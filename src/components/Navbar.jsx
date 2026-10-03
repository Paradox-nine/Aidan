import React from 'react';
import { Shield, LogOut, Calendar } from 'lucide-react';

export default function Navbar({ user, onOpenAdminModal, onOpenDashboard, onLogout, onNavigate }) {
  const handleNavClick = (path, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <a
          href="/"
          onClick={(e) => handleNavClick('/', e)}
          className="navbar-brand"
        >
          <img
            src="/images/logo.png"
            alt="WYTU Logo"
            className="w-8 h-8 object-contain rounded bg-white p-0.5 border border-yellow-400"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="brand-name">WYTU<span className="brand-dot">.</span></span>
        </a>

        <nav className="navbar-nav">
          <a
            href="/"
            onClick={(e) => handleNavClick('/', e)}
            className="nav-link"
          >
            Catalog
          </a>

          <a
            href="/events"
            onClick={(e) => handleNavClick('/events', e)}
            className="nav-link flex items-center gap-1"
          >
            <Calendar size={16} />
            <span>Events</span>
          </a>

          {user ? (
            <div className="user-controls">
              <button onClick={onOpenDashboard} className="btn btn-secondary btn-sm">
                <Shield size={16} />
                <span>Dashboard</span>
              </button>
              <button onClick={onLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAdminModal} className="btn btn-primary btn-sm">
              Admin Area
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
