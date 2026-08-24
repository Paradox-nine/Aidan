import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import { ShoppingBag, PackageSearch, RefreshCw } from 'lucide-react';

export default function ProductGrid({ products = [], loading = false, onSelectProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  // Derive unique categories and brands dynamically
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term filter (matches name, category, brand, tag, note)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesCat = p.category?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesTag = p.tag?.toLowerCase().includes(query);
        const matchesNote = p.note?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesBrand && !matchesTag && !matchesNote) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand && p.brand !== selectedBrand) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'in_stock' && !p.in_stock) return false;
      if (stockFilter === 'out_of_stock' && p.in_stock) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, stockFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setStockFilter('all');
  };

  if (loading) {
    return (
      <section id="catalog-section" className="catalog-section">
        <div className="section-container">
          <div className="catalog-grid-layout">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="product-card skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalog-section" className="catalog-section">
      <div className="section-container">
        <div className="catalog-header">
          <div className="section-tag">
            <ShoppingBag size={16} />
            <span>Product Catalog</span>
          </div>
          <h2 className="section-title">Explore Our Products</h2>
          <p className="section-subtitle">
            Browse through our available items, filter by brand & category, and select products to build your selection list.
          </p>
        </div>

        <div className="catalog-controls">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
          <FilterBar
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            onResetFilters={handleResetFilters}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-catalog-state">
            <PackageSearch size={48} className="empty-icon" />
            <h3>No Products Found</h3>
            <p>We couldn't find any products matching your current filters or search term.</p>
            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
              <RefreshCw size={14} /> Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="catalog-grid-layout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
