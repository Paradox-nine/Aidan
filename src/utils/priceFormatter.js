/**
 * Helper utilities for price formatting and total calculations
 */

/**
 * Clean and parse price string or number into a valid float.
 * Returns null if price is "-" or invalid/non-numeric.
 */
export function parsePrice(price) {
  if (price === null || price === undefined) return null;
  if (typeof price === 'number') {
    return isNaN(price) ? null : price;
  }

  const str = String(price).trim();
  if (str === '-' || str === '' || str.toLowerCase() === 'n/a') return null;

  // Strip currency symbols/letters except digits and dot
  // Keep standard digits and decimals. Note: handle commas e.g., "10,000 Ks" -> "10000"
  const cleaned = str.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Format numeric price or return fallback string
 */
export function formatPrice(price, currency = 'Ks') {
  const parsed = parsePrice(price);
  if (parsed === null) {
    return typeof price === 'string' && price.trim() !== '' ? price : '-';
  }
  const formattedNumber = new Intl.NumberFormat('en-US').format(parsed);
  return currency ? `${formattedNumber} ${currency}` : formattedNumber;
}

/**
 * Calculate line total for a selected product and quantity.
 * Returns formatted string or null if price is invalid.
 */
export function calculateLineTotal(price, quantity) {
  const numericPrice = parsePrice(price);
  const qty = parseInt(quantity, 10) || 1;
  if (numericPrice === null) return null;
  return numericPrice * qty;
}

/**
 * Calculate grand total for an array of selected items.
 * Ignores items with invalid/non-numeric prices.
 */
export function calculateGrandTotal(items = []) {
  let total = 0;
  let hasValidPrice = false;

  for (const item of items) {
    const lineTotal = calculateLineTotal(item.price, item.quantity);
    if (lineTotal !== null) {
      total += lineTotal;
      hasValidPrice = true;
    }
  }

  return {
    total,
    hasValidPrice,
    formatted: hasValidPrice ? new Intl.NumberFormat('en-US').format(total) : '-'
  };
}
