import React from 'react';
import SelectionItem from './SelectionItem';
import { ShoppingBag, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SelectionPanel({
  isOpen,
  onClose,
  selectionHook,
  products = []
}) {
  const {
    selectedItems,
    removeItem,
    updateQuantity,
    updateColor,
    clearSelection,
    totalItemsCount,
    calculateTotals
  } = selectionHook;

  if (!isOpen) return null;

  const { itemsWithTotals, formattedGrandTotal, hasNumericPrice } = calculateTotals();

  // Find original product info for color dropdown choices
  const getProductColors = (productId) => {
    const found = products.find((p) => p.id === productId);
    return found ? found.colors || [] : [];
  };

  return (
    <div className="selection-drawer-overlay" onClick={onClose}>
      <div className="selection-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-box">
            <ShoppingBag className="drawer-icon" size={20} />
            <h3>Selected Products ({totalItemsCount})</h3>
          </div>
          <button onClick={onClose} className="drawer-close-btn" title="Close selection">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {selectedItems.length === 0 ? (
            <div className="empty-selection-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h4>Your selection is empty</h4>
              <p>Browse the catalog and add products to create your selection list.</p>
            </div>
          ) : (
            <div className="selection-items-list">
              {itemsWithTotals.map((item) => (
                <SelectionItem
                  key={item.key}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onUpdateColor={updateColor}
                  availableColors={getProductColors(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Total Items:</span>
                <span className="summary-value">{totalItemsCount}</span>
              </div>

              <div className="summary-row grand-total-row">
                <span className="grand-total-label">Grand Total:</span>
                <span className="grand-total-value">{formattedGrandTotal}</span>
              </div>

              {!hasNumericPrice && (
                <p className="price-notice-text">
                  * Contains products with unavailable or custom pricing.
                </p>
              )}
            </div>

            <div className="drawer-actions">
              <button
                className="btn btn-outline btn-sm clear-all-btn"
                onClick={clearSelection}
              >
                <Trash2 size={16} /> Clear All
              </button>
              <button
                className="btn btn-primary btn-full"
                onClick={onClose}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
