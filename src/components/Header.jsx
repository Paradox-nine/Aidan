import React, { useState } from 'react';
import { Calendar, Lock, Unlock, ShoppingBag } from 'lucide-react';

export default function Header({ isAdminLoggedIn, onLogoutAdmin, onNavigate }) {
  const currentPath = window.location.pathname;
  const [logoError, setLogoError] = useState(false);

  const handleNavClick = (path, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-40 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a
          href="/"
          onClick={(e) => handleNavClick('/', e)}
          className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-yellow-400 rounded-lg p-1 group"
        >
          {!logoError ? (
            <img
              src="/images/logo.png"
              alt="WYTU Logo"
              className="w-10 h-10 object-contain rounded-xl bg-white p-1 border-2 border-yellow-400 shadow-sm"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="bg-yellow-400 p-2 rounded-xl text-blue-950 font-black">
              <ShoppingBag className="w-7 h-7" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight my-0 text-white leading-tight group-hover:text-yellow-300 transition-colors">
              WYTU
            </h1>
            <p className="text-yellow-300 text-xs font-semibold tracking-wide">
              West Yangon Technological University
            </p>
          </div>
        </a>

        {/* Navigation Links & Admin Controls */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              onClick={(e) => handleNavClick('/', e)}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm sm:text-base transition-all ${
                currentPath === '/' || currentPath === ''
                  ? 'bg-yellow-400 text-blue-950 shadow-sm'
                  : 'text-white hover:bg-blue-800 hover:text-yellow-300'
              }`}
            >
              Catalog
            </a>

            <a
              href="/events"
              onClick={(e) => handleNavClick('/events', e)}
              className={`px-3.5 py-2 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-1.5 ${
                currentPath.startsWith('/events')
                  ? 'bg-yellow-400 text-blue-950 shadow-sm'
                  : 'text-white hover:bg-blue-800 hover:text-yellow-300'
              }`}
            >
              <Calendar className="w-4 h-4" /> Events
            </a>
          </nav>

          <div className="border-l border-blue-700 h-6 mx-1 hidden sm:block"></div>

          {currentPath === '/admin' ? (
            <a
              href="/"
              onClick={(e) => handleNavClick('/', e)}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md transition border-2 border-yellow-500 flex items-center gap-2"
            >
              ← Back
            </a>
          ) : isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <a
                href="/admin"
                onClick={(e) => handleNavClick('/admin', e)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition border-2 border-emerald-400 flex items-center gap-1.5"
              >
                <Unlock className="w-4 h-4" /> Admin
              </a>
              <button
                onClick={onLogoutAdmin}
                className="bg-red-700 hover:bg-red-600 text-white font-bold px-3 py-2 rounded-xl text-sm shadow-md transition border-2 border-red-500 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/admin"
              onClick={(e) => handleNavClick('/admin', e)}
              className="bg-blue-800 hover:bg-blue-700 text-yellow-300 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm border border-blue-600 transition flex items-center gap-1.5 focus:ring-4 focus:ring-yellow-300"
            >
              <Lock className="w-4 h-4" /> Admin
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
