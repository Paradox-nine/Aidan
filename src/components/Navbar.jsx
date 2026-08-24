import React from 'react';
import { Package, Shield, LogOut, ShoppingBag } from 'lucide-react';

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
            <Package size={22} />
          </div>
          <span className="brand-name">SmartCatalog<span className="brand-dot">.</span></span>
        </div>

        <nav className="navbar-nav">
          <button
            type="button"
            className="btn btn-selection-nav"
            onClick={onOpenSelection}
          >
            <ShoppingBag size={18} />
            <span className="selection-btn-text">Selection</span>
            <span className="selection-badge">{selectionCount}</span>
          </button>

          {user ? (
            <div className="user-controls">
              <button onClick={onOpenDashboard} className="btn btn-secondary btn-sm">
                <Shield size={16} />
                <span>Admin Panel</span>
              </button>
              <button onClick={onLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAdminModal} className="btn btn-outline btn-sm btn-admin">
              <Shield size={16} />
              <span>Admin Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
