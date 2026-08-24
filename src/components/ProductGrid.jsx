import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

export default function ProductGrid({ products = [], loading = false, onSelectProduct }) {
  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="product-card skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-catalog">
        <PackageX size={48} className="empty-icon" />
        <h3>No Products Found</h3>
        <p>Try adjusting your search terms or filter selections.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
}
