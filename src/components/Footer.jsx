import React from 'react';
import { Code2, Lock, Heart } from 'lucide-react';

export default function Footer({ onOpenAdminModal, user, onOpenDashboard }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-icon">
              <Code2 size={20} />
            </div>
            <span className="brand-name">DevClub<span className="brand-dot">.</span></span>
            <p className="footer-tagline">Empowering developers through community, learning, and creation.</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Navigation</h4>
              <a href="#announcements">Feed</a>
              <a href="#about">About Us</a>
            </div>
            
            <div className="link-group">
              <h4>Connect</h4>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Coding Club. Built with React & Firebase.
          </p>

          <div className="footer-admin">
            {user ? (
              <button onClick={onOpenDashboard} className="admin-link">
                <Lock size={12} />
                <span>Admin Dashboard Active</span>
              </button>
            ) : (
              <button onClick={onOpenAdminModal} className="admin-link-discreet">
                <Lock size={12} />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
