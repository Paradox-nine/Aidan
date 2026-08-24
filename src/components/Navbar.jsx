import React from 'react';
import { ShoppingBag, Shield, LogOut, Package } from 'lucide-react';

export default function Navbar({
  user,
  selectionCount = 0,
  onOpenSelection,
  onOpenAdminModal,
  onOpenDashboard,
  onLogout
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon">
            <Package size={24} />
          </div>
          <span className="brand-name">SmartCatalog<span className="brand-dot">.</span></span>
        </div>

        <nav className="navbar-nav">
          <a href="#catalog-section" className="nav-link">Catalog</a>
          <a href="#about" className="nav-link">About Us</a>
          
          <button
            onClick={onOpenSelection}
            className="btn btn-secondary btn-sm selection-badge-btn"
          >
            <ShoppingBag size={16} />
            <span>Selection ({selectionCount})</span>
          </button>

          {user ? (
            <div className="user-controls">
              <button onClick={onOpenDashboard} className="btn btn-primary btn-sm">
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </button>
              <button onClick={onLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAdminModal} className="btn btn-outline btn-sm">
              <Shield size={16} />
              <span>Admin Area</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
