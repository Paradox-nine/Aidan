import React from 'react';
import { Plus, Minus, Trash2, Layers } from 'lucide-react';
import { formatPrice, calculateLineTotal } from '../utils/priceFormatter';

export default function SelectionItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotalNum = calculateLineTotal(item.price, item.quantity);
  const lineTotalDisplay = lineTotalNum !== null
    ? formatPrice(lineTotalNum, item.currency)
    : '-';

  return (
    <div className="selection-item">
      <div className="selection-item-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} />
        ) : (
          <div className="placeholder-thumb">
            <Layers size={18} />
          </div>
        )}
      </div>

      <div className="selection-item-info">
        <h4 className="item-name">{item.name}</h4>

        {item.color && (
          <span className="item-color-tag">Color: {item.color}</span>
        )}

        <div className="item-price-row">
          <span className="unit-price">
            {formatPrice(item.price, item.currency)}
          </span>
          <span className="qty-multiply">× {item.quantity}</span>
        </div>

        <div className="item-controls">
          <div className="quantity-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
              title="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.key, e.target.value)}
              className="quantity-input"
            />
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
              title="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            className="btn-remove-item"
            onClick={() => onRemove(item.key)}
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="selection-item-total">
        <span className="total-label">Line Total</span>
        <span className="line-total-value">{lineTotalDisplay}</span>
      </div>
    </div>
  );
}
