import React from 'react';
import { Package, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Hero({ totalProductsCount = 0 }) {
  return (
    <section className="hero-section">
      <div className="hero-background-grid"></div>
      <div className="hero-container">
        <div className="hero-badge">
          <Sparkles size={16} className="badge-icon" />
          <span>Smart Responsive Product Catalog</span>
        </div>
        
        <h1 className="hero-title">
          Explore Products, <br />
          <span className="gradient-text">Build Your Selection Easily.</span>
        </h1>
        
        <p className="hero-subtitle">
          Browse items across Skincare, Cosmetics, and personal care. Create your custom product selection list with dynamic pricing and availability updates.
        </p>

        <div className="hero-actions">
          <a href="#catalog-section" className="btn btn-primary btn-lg">
            <ShoppingBag size={18} /> Browse Catalog
          </a>
          <a href="#about" className="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <Package className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">{totalProductsCount || '20+'}</span>
              <span className="stat-label">Products Listed</span>
            </div>
          </div>

          <div className="stat-card">
            <Sparkles className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">100%</span>
              <span className="stat-label">Responsive Layout</span>
            </div>
          </div>

          <div className="stat-card">
            <ShieldCheck className="stat-icon" size={20} />
            <div className="stat-info">
              <span className="stat-value">Supabase</span>
              <span className="stat-label">Database Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
