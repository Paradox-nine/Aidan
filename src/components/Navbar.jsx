import React from 'react';
import { Code2, Shield, LogOut } from 'lucide-react';

export default function Navbar({ user, onOpenAdminModal, onOpenDashboard, onLogout }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon">
            <Code2 size={24} />
          </div>
          <span className="brand-name">DevClub<span className="brand-dot">.</span></span>
        </div>

        <nav className="navbar-nav">
          <a href="#announcements" className="nav-link">Announcements</a>
          <a href="#about" className="nav-link">About Us</a>
          
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
