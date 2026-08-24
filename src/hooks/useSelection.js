import { useState, useEffect } from 'react';

/**
 * Safely parses numeric value from string or number price.
 * Handles comma-formatted values e.g. "5,000", "10,000 Ks", 18000.
 * Returns null if price is "-" or non-numeric/invalid.
 */
export function parsePrice(priceStr) {
  if (priceStr === null || priceStr === undefined) return null;
  const str = String(priceStr).trim();
  if (!str || str === '-' || str.toLowerCase() === 'price unavailable') return null;

  // Extract digits and optional decimal point
  const cleanStr = str.replace(/[^0-9.]/g, '');
  if (!cleanStr) return null;

  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Formats a number back to localized comma string
 */
export function formatPriceNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return num.toLocaleString();
}

export function useSelection() {
  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_catalog_selection');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_catalog_selection', JSON.stringify(selectedItems));
    } catch (e) {
      console.error("Failed to save selection to localStorage:", e);
    }
  }, [selectedItems]);

  const addItem = (product, selectedColor = null) => {
    const colorChoice = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
    const itemKey = `${product.id}_${colorChoice || 'default'}`;

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            key: itemKey,
            id: product.id,
            name: product.name,
            image_url: product.image_url || product.image || '',
            price: product.price,
            currency: product.currency || 'Ks',
            color: colorChoice,
            quantity: 1
          }
        ];
      }
    });
  };

  const removeItem = (key) => {
    setSelectedItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    const newQty = Math.max(1, parseInt(quantity, 10) || 1);
    setSelectedItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: newQty } : item))
    );
  };

  const updateColor = (key, newColor) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          const newKey = `${item.id}_${newColor || 'default'}`;
          return { ...item, key: newKey, color: newColor };
        }
        return item;
      })
    );
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  // Calculations
  const totalItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculates total value for items with valid numeric prices safely
  const calculateTotals = () => {
    let grandTotal = 0;
    let hasNumericPrice = false;

    const itemsWithTotals = selectedItems.map((item) => {
      const numPrice = parsePrice(item.price);
      if (numPrice !== null) {
        hasNumericPrice = true;
        const lineTotalNum = numPrice * item.quantity;
        grandTotal += lineTotalNum;
        return {
          ...item,
          numericPrice: numPrice,
          lineTotal: `${formatPriceNumber(lineTotalNum)} ${item.currency}`,
          hasPrice: true
        };
      } else {
        return {
          ...item,
          numericPrice: null,
          lineTotal: '-',
          hasPrice: false
        };
      }
    });

    const formattedGrandTotal = hasNumericPrice ? `${formatPriceNumber(grandTotal)} Ks` : '-';

    return {
      itemsWithTotals,
      grandTotal,
      formattedGrandTotal,
      hasNumericPrice
    };
  };

  return {
    selectedItems,
    addItem,
    removeItem,
    updateQuantity,
    updateColor,
    clearSelection,
    totalItemsCount,
    calculateTotals
  };
}
