import React from 'react';
import { ShoppingBag, X, Trash2, CheckCircle, Info } from 'lucide-react';
import SelectionItem from './SelectionItem';
import { calculateGrandTotal } from '../utils/priceFormatter';

export default function SelectionPanel({
  selectedItems = [],
  onUpdateQuantity,
  onUpdateColor,
  onRemove,
  onClear,
  isOpen,
  onClose
}) {
  const grandTotal = calculateGrandTotal(selectedItems);

  if (!isOpen) return null;

  return (
    <div className="selection-overlay" onClick={onClose}>
      <div className="selection-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="selection-header">
          <div className="selection-title-group">
            <div className="selection-icon">
              <ShoppingBag size={20} />
            </div>
            <h3>
              Selected Products <span className="item-count-badge">({selectedItems.length})</span>
            </h3>
          </div>
          <button onClick={onClose} className="btn-close-drawer" title="Close Panel">
            <X size={20} />
          </button>
        </div>

        <div className="selection-body">
          {selectedItems.length === 0 ? (
            <div className="empty-selection">
              <ShoppingBag size={48} className="empty-icon" />
              <h4>Your Selection List is Empty</h4>
              <p>Browse products in the catalog and click "Select" to build your list.</p>
            </div>
          ) : (
            <div className="selection-list">
              {selectedItems.map((item) => (
                <SelectionItem
                  key={item.key}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onUpdateColor={onUpdateColor}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="selection-footer">
            {!grandTotal.hasValidPrice && (
              <div className="price-warning-banner">
                <Info size={14} />
                <span>Selected items contain unpriced products ("-"). Prices will be calculated once set by admin.</span>
              </div>
            )}

            <div className="summary-row">
              <span className="summary-label">Total Selected Items:</span>
              <span className="summary-value">
                {selectedItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            </div>

            <div className="summary-row grand-total-row">
              <span className="summary-label">Grand Total:</span>
              <span className="grand-total-value">
                {grandTotal.formatted} {selectedItems[0]?.currency || 'Ks'}
              </span>
            </div>

            <div className="selection-actions">
              <button
                type="button"
                className="btn btn-outline btn-clear"
                onClick={onClear}
              >
                <Trash2 size={16} /> Clear All
              </button>
              <button
                type="button"
                className="btn btn-primary btn-confirm"
                onClick={() => alert('Product selection list created successfully! You can export or present this summary.')}
              >
                <CheckCircle size={16} /> Confirm Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
