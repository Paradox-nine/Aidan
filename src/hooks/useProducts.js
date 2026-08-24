import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_STORAGE_KEY = 'smart_catalog_demo_products';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load local storage fallback
  const getLocalProducts = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse local products:', e);
    }
    return INITIAL_PRODUCTS;
  }, []);

  // Save to local storage fallback
  const saveLocalProducts = useCallback((data) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setProducts(data);
    } catch (e) {
      console.error('Failed to save local products:', e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setProducts(getLocalProducts());
      setLoading(false);
      return;
    }

    try {
      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      // Normalize columns if needed
      const normalizedData = (data || []).map(item => ({
        ...item,
        inStock: item.in_stock !== undefined ? item.in_stock : item.inStock,
        imageUrl: item.image_url || item.image || item.imageUrl,
      }));

      setProducts(normalizedData);
    } catch (err) {
      console.error('Supabase fetch products error:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts(getLocalProducts());
    } finally {
      setLoading(false);
    }
  }, [getLocalProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Upload product image to Supabase Storage 'product-images'
  const uploadImage = async (file) => {
    if (!file) return null;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB.');
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file format. Please upload JPG, PNG, or WEBP images.');
    }

    if (!isSupabaseConfigured) {
      // Return a base64 / Object URL preview for local demo
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // Add Product
  const addProduct = async (productData, imageFile) => {
    let uploadedImageUrl = productData.image_url || productData.image || '';

    if (imageFile) {
      uploadedImageUrl = await uploadImage(imageFile);
    }

    const newProduct = {
      name: productData.name,
      image_url: uploadedImageUrl,
      price: productData.price,
      currency: productData.currency || 'Ks',
      in_stock: Boolean(productData.in_stock),
      note: productData.note || '',
      category: productData.category || 'General',
      brand: productData.brand || '',
      tag: productData.tag || '',
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchProducts();
      return data;
    } else {
      const demoItem = {
        id: 'product-' + Date.now(),
        ...newProduct,
        inStock: newProduct.in_stock,
        imageUrl: newProduct.image_url,
        created_at: new Date().toISOString()
      };
      const updated = [demoItem, ...products];
      saveLocalProducts(updated);
      return demoItem;
    }
  };

  // Edit Product
  const updateProduct = async (id, productData, imageFile) => {
    let uploadedImageUrl = productData.image_url || productData.imageUrl || '';

    if (imageFile) {
      uploadedImageUrl = await uploadImage(imageFile);
    }

    const updatedFields = {
      name: productData.name,
      image_url: uploadedImageUrl,
      price: productData.price,
      currency: productData.currency || 'Ks',
      in_stock: Boolean(productData.in_stock),
      note: productData.note || '',
      category: productData.category || 'General',
      brand: productData.brand || '',
      tag: productData.tag || '',
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchProducts();
      return data;
    } else {
      const updated = products.map((item) =>
        item.id === id ? { ...item, ...updatedFields, inStock: updatedFields.in_stock, imageUrl: updatedFields.image_url } : item
      );
      saveLocalProducts(updated);
      return updatedFields;
    }
  };

  // Delete Product
  const deleteProduct = async (id, imageUrl) => {
    if (isSupabaseConfigured) {
      // Attempt image cleanup if URL comes from product-images bucket
      if (imageUrl && imageUrl.includes('product-images')) {
        try {
          const parts = imageUrl.split('/product-images/');
          if (parts[1]) {
            await supabase.storage.from('product-images').remove([parts[1]]);
          }
        } catch (e) {
          console.warn('Could not clean up image from storage:', e);
        }
      }

      const { error: delError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (delError) throw delError;
      await fetchProducts();
    } else {
      const updated = products.filter((item) => item.id !== id);
      saveLocalProducts(updated);
    }
  };

  // Quick toggle in_stock status
  const toggleStock = async (id, currentStock) => {
    const updatedStock = !currentStock;
    if (isSupabaseConfigured) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ in_stock: updatedStock, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchProducts();
    } else {
      const updated = products.map((item) =>
        item.id === id ? { ...item, in_stock: updatedStock, inStock: updatedStock } : item
      );
      saveLocalProducts(updated);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock
  };
}
