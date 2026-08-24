import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, AlertCircle } from 'lucide-react';

export default function ProductForm({ initialProduct = null, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('Ks');
  const [inStock, setInStock] = useState(true);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [tag, setTag] = useState('');
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setPrice(initialProduct.price || '');
      setCurrency(initialProduct.currency || 'Ks');
      setInStock(initialProduct.in_stock !== undefined ? initialProduct.in_stock : (initialProduct.inStock ?? true));
      setNote(initialProduct.note || '');
      setCategory(initialProduct.category || '');
      setBrand(initialProduct.brand || '');
      setTag(initialProduct.tag || '');
      setColors(Array.isArray(initialProduct.colors) ? initialProduct.colors : []);
      setImagePreview(initialProduct.image_url || initialProduct.image || initialProduct.imageUrl || '');
    }
  }, [initialProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, and WEBP are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
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

  const handleRemoveColor = (indexToRemove) => {
    setColors(colors.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product Name is required.');
      return;
    }

    const productPayload = {
      name: name.trim(),
      price: price.trim(),
      currency: currency.trim(),
      in_stock: inStock,
      note: note.trim(),
      category: category.trim() || 'General',
      brand: brand.trim(),
      tag: tag.trim(),
      colors: colors,
      image_url: imagePreview
    };

    onSubmit(productPayload, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="prod-name">Product Name *</label>
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
          <label htmlFor="prod-price">Price (use "-" if unpriced)</label>
          <input
            id="prod-price"
            type="text"
            placeholder="e.g. 5,000 or -"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prod-currency">Currency</label>
          <input
            id="prod-currency"
            type="text"
            placeholder="e.g. Ks or $"
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
            placeholder="e.g. Cosmetic, Skincare"
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
          <label htmlFor="prod-tag">Tag / Badge</label>
          <input
            id="prod-tag"
            type="text"
            placeholder="e.g. Popular, Best Seller"
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
            <span>In Stock</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="prod-note">Note / Description</label>
        <textarea
          id="prod-note"
          rows="3"
          placeholder="Short product description..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      {/* Colors dynamic section */}
      <div className="form-group">
        <label>Product Colors</label>
        <div className="color-input-row">
          <input
            type="text"
            placeholder="Add color variant e.g. Ruby Red"
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
            <Plus size={16} /> Add Color
          </button>
        </div>

        {colors.length > 0 && (
          <div className="colors-chip-list">
            {colors.map((c, idx) => (
              <span key={idx} className="color-chip">
                {c}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="chip-remove-btn"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image upload section */}
      <div className="form-group">
        <label>Product Image (Supabase Storage: product-images)</label>
        <div className="file-upload-wrapper">
          <input
            type="file"
            id="product-image-file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="file-input-hidden"
          />
          <label htmlFor="product-image-file" className="file-upload-label">
            <Upload size={18} />
            <span>{imageFile ? imageFile.name : 'Upload JPEG, PNG, or WEBP image...'}</span>
          </label>
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview('');
              }}
              className="remove-preview-btn"
            >
              <X size={14} /> Remove Image
            </button>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialProduct ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
