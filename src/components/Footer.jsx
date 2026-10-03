import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [logoError, setLogoError] = useState(false);

  const handleNavClick = (path, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12 border-t-4 border-yellow-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/images/logo.png"
                  alt="WYTU Logo"
                  className="w-10 h-10 object-contain rounded-xl bg-white p-1 border-2 border-yellow-400"
                  onError={() => setLogoError(true)}
                />
              ) : null}
              <span className="text-2xl font-black text-yellow-300">
                West Yangon Technological University
              </span>
            </div>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              Official Academic Portal for Engineering Excellence, Research Innovations, and Student Events Management.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold text-yellow-400 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNavClick('/', e)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Product Catalog
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  onClick={(e) => handleNavClick('/events', e)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Events &amp; Announcements
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Area Link */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold text-yellow-400 uppercase tracking-wider">
              Administration
            </h4>
            <a
              href="/admin"
              onClick={(e) => handleNavClick('/admin', e)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-yellow-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Portal Login
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} West Yangon Technological University (WYTU). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
