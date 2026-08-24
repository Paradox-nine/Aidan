import React from 'react';
import { Plus, Minus, Trash2, Palette } from 'lucide-react';

export default function SelectionItem({ item, onUpdateQuantity, onRemoveItem, onUpdateColor, availableColors = [] }) {
  const { key, name, image_url, price, currency = 'Ks', color, quantity, lineTotal, hasPrice } = item;

  return (
    <div className="selection-item">
      <div className="selection-item-image-wrapper">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="selection-item-thumb"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      <div className="selection-item-details">
        <h4 className="selection-item-name">{name}</h4>

        <div className="selection-item-submeta">
          <span className="unit-price">
            Unit Price: {hasPrice ? `${price} ${currency}` : '-'}
          </span>
          {!hasPrice && <span className="price-unavail-tag">Price unavailable</span>}
        </div>

        {color && (
          <div className="selection-item-color">
            <span className="color-label">
              <Palette size={12} /> Color: <strong>{color}</strong>
            </span>
          </div>
        )}

        <div className="selection-item-controls">
          <div className="quantity-control-group">
            <button
              className="qty-btn"
              onClick={() => onUpdateQuantity(key, quantity - 1)}
              title="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min="1"
              className="qty-input"
              value={quantity}
              onChange={(e) => onUpdateQuantity(key, e.target.value)}
            />
            <button
              className="qty-btn"
              onClick={() => onUpdateQuantity(key, quantity + 1)}
              title="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="line-total-display">
            <span className="line-total-label">Line Total:</span>
            <span className="line-total-value">{lineTotal}</span>
          </div>

          <button
            className="remove-item-btn"
            onClick={() => onRemoveItem(key)}
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
