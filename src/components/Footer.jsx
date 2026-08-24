import React from 'react';
import { Code2, Lock } from 'lucide-react';

export default function Footer({ onOpenAdminModal, user, onOpenDashboard }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-icon">
              <Code2 size={20} />
            </div>
            <span className="brand-name">SmartCatalog<span className="brand-dot">.</span></span>
            <p className="footer-tagline">Empowering responsive product catalog and selection management.</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Navigation</h4>
              <a href="#catalog">Catalog</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Smart Catalog. All rights reserved.
          </p>

          <div className="footer-admin">
            {user ? (
              <button onClick={onOpenDashboard} className="admin-link">
                <Lock size={12} />
                <span>Admin Panel Active</span>
              </button>
            ) : (
              <button onClick={onOpenAdminModal} className="admin-link-discreet">
                <Lock size={12} />
                <span>Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
