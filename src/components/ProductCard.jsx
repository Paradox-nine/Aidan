import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Palette, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }) {
  const {
    id,
    name,
    image_url,
    price,
    currency = 'Ks',
    in_stock = true,
    note,
    category,
    brand,
    tag,
    colors = []
  } = product;

  const [selectedColor, setSelectedColor] = useState(
    colors && colors.length > 0 ? colors[0] : null
  );

  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddClick = () => {
    if (!in_stock) return;
    onSelectProduct(product, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isPriceUnavailable = !price || price === '-' || price.toLowerCase() === 'price unavailable';

  return (
    <div className={`product-card ${!in_stock ? 'out-of-stock-card' : ''}`}>
      <div className="product-image-container">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {tag && <span className="product-tag">{tag}</span>}

        <span className={`stock-badge ${in_stock ? 'in-stock' : 'out-of-stock'}`}>
          {in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="product-info">
        <div className="product-meta">
          {category && <span className="product-category">{category}</span>}
          {brand && <span className="product-brand">• {brand}</span>}
        </div>

        <h3 className="product-name">{name}</h3>

        {note && <p className="product-note">{note}</p>}

        {colors && colors.length > 0 && (
          <div className="product-colors">
            <span className="color-label">
              <Palette size={12} /> Color:
            </span>
            <div className="color-options">
              {colors.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`color-chip ${selectedColor === col ? 'active' : ''}`}
                  onClick={() => setSelectedColor(col)}
                  title={col}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="product-footer">
          <div className="product-price-box">
            <span className="price-value">
              {isPriceUnavailable ? '-' : price}
            </span>
            {!isPriceUnavailable && <span className="price-currency">{currency}</span>}
            {isPriceUnavailable && <span className="price-unavailable-sub">Price unavailable</span>}
          </div>

          <button
            className={`btn ${addedAnimation ? 'btn-success' : 'btn-primary'} btn-sm add-selection-btn`}
            onClick={handleAddClick}
            disabled={!in_stock}
          >
            {addedAnimation ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <Plus size={16} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
