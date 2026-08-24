import { useState, useEffect } from 'react';

const SELECTION_STORAGE_KEY = 'smart_catalog_selected_items';

export function useSelection() {
  const [selectedItems, setSelectedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(SELECTION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse selected items from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selectedItems));
    } catch (e) {
      console.error('Failed to save selected items to localStorage:', e);
    }
  }, [selectedItems]);

  // Add product or increase quantity if already present (considering selected color)
  const addItem = (product, selectedColor = null) => {
    setSelectedItems((prev) => {
      const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
      const itemKey = `${product.id}_${color || 'no-color'}`;

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
            image_url: product.image_url || product.image || product.imageUrl,
            price: product.price,
            currency: product.currency || 'Ks',
            color: color,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateQuantity = (key, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeItem(key);
      return;
    }

    setSelectedItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: qty } : item))
    );
  };

  const updateColor = (key, newColor) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, color: newColor } : item))
    );
  };

  const removeItem = (key) => {
    setSelectedItems((prev) => prev.filter((item) => item.key !== key));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const totalItemCount = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return {
    selectedItems,
    addItem,
    updateQuantity,
    updateColor,
    removeItem,
    clearSelection,
    totalItemCount
  };
}
