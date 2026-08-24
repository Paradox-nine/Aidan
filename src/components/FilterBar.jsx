import React from 'react';
import { Filter, Layers, Tag, CheckCircle, AlertCircle } from 'lucide-react';

export default function FilterBar({
  categories = [],
  brands = [],
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  stockFilter,
  onStockFilterChange,
  onResetFilters
}) {
  const isFiltered = selectedCategory || selectedBrand || stockFilter !== 'all';

  return (
    <div className="filter-bar-container">
      <div className="filter-group">
        <label htmlFor="category-select" className="filter-label">
          <Layers size={14} /> Category
        </label>
        <select
          id="category-select"
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="brand-select" className="filter-label">
          <Tag size={14} /> Brand
        </label>
        <select
          id="brand-select"
          className="filter-select"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="stock-select" className="filter-label">
          <CheckCircle size={14} /> Availability
        </label>
        <select
          id="stock-select"
          className="filter-select"
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
        >
          <option value="all">All Items</option>
          <option value="in_stock">In Stock Only</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {isFiltered && (
        <button className="btn btn-outline btn-sm filter-reset-btn" onClick={onResetFilters}>
          Reset Filters
        </button>
      )}
    </div>
  );
}
