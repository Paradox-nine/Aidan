import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterBar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  brands = [],
  selectedBrand,
  setSelectedBrand
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">
          <Filter size={14} /> Category:
        </label>
        <div className="filter-pills">
          <button
            className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Brand:</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="brand-select"
          >
            <option value="All">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
