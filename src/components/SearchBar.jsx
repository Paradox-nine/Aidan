import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar-container">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Search products by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="search-clear-btn"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
