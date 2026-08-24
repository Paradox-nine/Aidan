import React, { useState } from 'react';
import { ShoppingBag, Check, Tag as TagIcon, Layers, Palette } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';

export default function ProductCard({ product, onSelect }) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [added, setAdded] = useState(false);

  const imageUrl = product.image_url || product.image || product.imageUrl;
  const inStock = product.in_stock !== undefined ? product.in_stock : product.inStock;

  const handleAdd = () => {
    if (!inStock) return;
    onSelect(product, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="product-image-placeholder">
            <Layers size={40} />
          </div>
        )}

        <div className="product-badges">
          {product.tag && (
            <span className="badge badge-tag">
              <TagIcon size={12} /> {product.tag}
            </span>
          )}
          {product.category && (
            <span className="badge badge-category">
              {product.category}
            </span>
          )}
        </div>

        {!inStock && (
          <div className="stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      <div className="product-content">
        {product.brand && <span className="product-brand">{product.brand}</span>}

        <h3 className="product-name">{product.name}</h3>

        {product.note && <p className="product-note">{product.note}</p>}

        {/* Available Colors Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            <span className="color-label">
              <Palette size={13} /> Color:
            </span>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-pill ${selectedColor === color ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="product-footer">
          <div className="product-price-container">
            <span className="price-label">Price</span>
            <span className="product-price">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          <button
            type="button"
            className={`btn btn-select ${added ? 'btn-added' : ''}`}
            onClick={handleAdd}
            disabled={!inStock}
          >
            {added ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> {inStock ? 'Select' : 'Unavailable'}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
