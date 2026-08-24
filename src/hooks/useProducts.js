import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Sample product dataset matching existing spec
export const INITIAL_PRODUCTS = [
  {
    id: "ustar-maxx-cover",
    name: "USTAR Maxx Cover Lipstick",
    image_url: "/uploads/ustar_maxx_cover.webp",
    price: "-",
    currency: "Ks",
    in_stock: true,
    note: "USTAR Maxx Cover Lipstick for everyday personal care.",
    category: "Cosmetic",
    brand: "USTAR",
    tag: "Popular",
    colors: [
      "Ruby Red",
      "Rose Pink",
      "Nude Beige",
      "Deep Plum"
    ],
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString()
  },
  {
    id: "cosrx-low-ph-cleanser",
    name: "COSRX Low pH Good Morning Gel Cleanser",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    price: "18000",
    currency: "Ks",
    in_stock: true,
    note: "Gentle gel cleanser formatted with tea tree oil and BHA.",
    category: "Skincare",
    brand: "COSRX",
    tag: "Bestseller",
    colors: [],
    created_at: new Date('2025-01-02').toISOString(),
    updated_at: new Date('2025-01-02').toISOString()
  },
  {
    id: "laneige-lip-sleeping-mask",
    name: "Laneige Lip Sleeping Mask Berry",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    price: "24,000",
    currency: "Ks",
    in_stock: true,
    note: "Nourishing lip mask for smooth, plump lips overnight.",
    category: "Lip Care",
    brand: "Laneige",
    tag: "Popular",
    colors: ["Berry", "Gummy Bear", "Vanilla", "Sweet Candy"],
    created_at: new Date('2025-01-03').toISOString(),
    updated_at: new Date('2025-01-03').toISOString()
  },
  {
    id: "anua-heartleaf-toner",
    name: "Anua Heartleaf 77% Soothing Toner",
    image_url: "https://images.unsplash.com/photo-1608248597260-6578e363cc0c?auto=format&fit=crop&w=800&q=80",
    price: "32,500",
    currency: "Ks",
    in_stock: false,
    note: "Hydrating toner infused with 77% Heartleaf extract for sensitive skin.",
    category: "Skincare",
    brand: "Anua",
    tag: "Trending",
    colors: [],
    created_at: new Date('2025-01-04').toISOString(),
    updated_at: new Date('2025-01-04').toISOString()
  }
];

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize backend product item (convert legacy inStock -> in_stock, image -> image_url)
  const normalizeProduct = (item) => ({
    id: item.id,
    name: item.name || '',
    image_url: item.image_url || item.image || '',
    price: item.price !== undefined && item.price !== null ? String(item.price) : '-',
    currency: item.currency || 'Ks',
    in_stock: item.in_stock !== undefined ? Boolean(item.in_stock) : Boolean(item.inStock ?? true),
    note: item.note || '',
    category: item.category || 'General',
    brand: item.brand || 'Generic',
    tag: item.tag || '',
    colors: Array.isArray(item.colors) ? item.colors : [],
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString()
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('smart_catalog_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProducts(parsed.map(normalizeProduct));
        } catch {
          setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
        }
      } else {
        setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      if (data && data.length > 0) {
        setProducts(data.map(normalizeProduct));
      } else {
        // Seed default products if database table is currently empty
        setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
      }
    } catch (err) {
      console.warn("Supabase products fetch fallback:", err.message);
      // Fallback to demo local products if DB connection or table is uninitialized
      const saved = localStorage.getItem('smart_catalog_products');
      if (saved) {
        try {
          setProducts(JSON.parse(saved).map(normalizeProduct));
        } catch {
          setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
        }
      } else {
        setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Upload Product Image to Supabase Storage bucket 'product-images'
  const uploadImage = async (file) => {
    if (!file) return '';

    // Validate type and size (<= 5MB)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Unsupported image file format. Supported: JPG, JPEG, PNG, WEBP.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds maximum limit of 5MB.');
    }

    if (!isSupabaseConfigured) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.warn("Supabase Storage upload error, falling back to base64:", uploadError);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const addProduct = async (productData, imageFile) => {
    let image_url = productData.image_url || '';
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }

    const newProduct = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name,
      image_url: image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      price: productData.price,
      currency: productData.currency || 'Ks',
      in_stock: Boolean(productData.in_stock),
      note: productData.note || '',
      category: productData.category || 'General',
      brand: productData.brand || 'Generic',
      tag: productData.tag || '',
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (insertError) {
        console.warn("Database insert fallback:", insertError.message);
      } else if (data) {
        setProducts((prev) => [normalizeProduct(data), ...prev]);
        return normalizeProduct(data);
      }
    }

    // Local fallback persistence
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('smart_catalog_products', JSON.stringify(updated));
    return newProduct;
  };

  const updateProduct = async (id, productData, imageFile) => {
    let image_url = productData.image_url;
    if (imageFile) {
      image_url = await uploadImage(imageFile);
    }

    const updatedFields = {
      name: productData.name,
      image_url,
      price: productData.price,
      currency: productData.currency || 'Ks',
      in_stock: Boolean(productData.in_stock),
      note: productData.note || '',
      category: productData.category || 'General',
      brand: productData.brand || 'Generic',
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

      if (updateError) {
        console.warn("Database update fallback:", updateError.message);
      } else if (data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? normalizeProduct(data) : p)));
        return normalizeProduct(data);
      }
    }

    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setProducts(updated);
    localStorage.setItem('smart_catalog_products', JSON.stringify(updated));
  };

  const deleteProduct = async (id) => {
    const targetProduct = products.find((p) => p.id === id);

    if (isSupabaseConfigured) {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.warn("Database delete error fallback:", deleteError.message);
      }

      // Try deleting storage image if it's hosted in product-images
      if (targetProduct?.image_url && targetProduct.image_url.includes('product-images')) {
        try {
          const pathParts = targetProduct.image_url.split('/product-images/');
          if (pathParts[1]) {
            await supabase.storage.from('product-images').remove([pathParts[1]]);
          }
        } catch (e) {
          console.warn("Storage deletion error:", e);
        }
      }
    }

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('smart_catalog_products', JSON.stringify(updated));
  };

  const toggleStockStatus = async (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    await updateProduct(id, { ...target, in_stock: !target.in_stock });
  };

  return {
    products,
    loading,
    error,
    refetchProducts: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStockStatus
  };
}
