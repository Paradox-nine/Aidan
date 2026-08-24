import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Upload,
  X,
  Tag,
  Palette,
  DollarSign,
  FileText,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProductForm({ initialProduct = null, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('Ks');
  const [inStock, setInStock] = useState(true);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [tag, setTag] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setPrice(initialProduct.price || '');
      setCurrency(initialProduct.currency || 'Ks');
      setInStock(initialProduct.in_stock !== undefined ? initialProduct.in_stock : true);
      setNote(initialProduct.note || '');
      setCategory(initialProduct.category || '');
      setBrand(initialProduct.brand || '');
      setTag(initialProduct.tag || '');
      setColors(Array.isArray(initialProduct.colors) ? [...initialProduct.colors] : []);
      setImagePreview(initialProduct.image_url || '');
    } else {
      setName('');
      setPrice('');
      setCurrency('Ks');
      setInStock(true);
      setNote('');
      setCategory('Skincare');
      setBrand('');
      setTag('');
      setColors([]);
      setImageFile(null);
      setImagePreview('');
    }
  }, [initialProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Unsupported image format. Accepted: JPG, JPEG, PNG, WEBP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be 5MB or less.');
        return;
      }

      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setColors([...colors, trimmed]);
      setColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    setLoading(true);

    try {
      const productPayload = {
        name: name.trim(),
        price: price.trim() === '' ? '-' : price.trim(),
        currency: currency.trim() || 'Ks',
        in_stock: Boolean(inStock),
        note: note.trim(),
        category: category.trim() || 'General',
        brand: brand.trim() || 'Generic',
        tag: tag.trim(),
        colors: colors,
        image_url: initialProduct?.image_url || ''
      };

      await onSubmit(productPayload, imageFile);
    } catch (err) {
      console.error("Product submission error:", err);
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-card">
      <div className="form-card-header">
        <h3>{initialProduct ? 'Edit Product' : 'Add New Product'}</h3>
        {onCancel && (
          <button type="button" className="btn btn-outline btn-sm" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="prod-name">
            <Package size={16} /> Product Name *
          </label>
          <input
            id="prod-name"
            type="text"
            placeholder="e.g. USTAR Maxx Cover Lipstick"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prod-price">
              <DollarSign size={16} /> Price (Enter '-' if unavailable)
            </label>
            <input
              id="prod-price"
              type="text"
              placeholder="e.g., 18,000 or -"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-currency">Currency</label>
            <input
              id="prod-currency"
              type="text"
              placeholder="e.g., Ks, $"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prod-category">Category</label>
            <input
              id="prod-category"
              type="text"
              placeholder="e.g. Skincare, Cosmetic"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-brand">Brand</label>
            <input
              id="prod-brand"
              type="text"
              placeholder="e.g. USTAR, COSRX"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prod-tag">Tag / Highlight</label>
            <input
              id="prod-tag"
              type="text"
              placeholder="e.g. Popular, Bestseller, Trending"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <span>In Stock Available</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prod-note">
            <FileText size={16} /> Note / Description
          </label>
          <textarea
            id="prod-note"
            rows="3"
            placeholder="Product description or special notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        {/* Dynamic Color Chips */}
        <div className="form-group">
          <label>
            <Palette size={16} /> Available Colors
          </label>
          <div className="color-input-wrapper">
            <input
              type="text"
              placeholder="Add color (e.g. Ruby Red)"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddColor}
            >
              Add Color
            </button>
          </div>

          {colors.length > 0 && (
            <div className="colors-tags-list">
              {colors.map((c) => (
                <span key={c} className="color-tag-item">
                  {c}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="remove-tag-btn"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image File Upload */}
        <div className="form-group">
          <label>Product Image (Supabase Storage: product-images)</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="prod-image-file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="file-input-hidden"
            />
            <label htmlFor="prod-image-file" className="file-upload-label">
              <Upload size={20} />
              <span>{imageFile ? imageFile.name : "Choose JPG, PNG, or WEBP image..."}</span>
            </label>
          </div>

          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(''); }}
                className="remove-preview-btn"
              >
                <X size={14} /> Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Saving to Supabase...' : initialProduct ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
