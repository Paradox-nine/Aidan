import React from 'react';
import { ShoppingBag, Lock, Unlock, Bot, Store, Terminal } from 'lucide-react';

export default function Header({ isAdminLoggedIn, onLogoutAdmin, onNavigate, currentPath: passedPath }) {
  const currentPath = passedPath || window.location.pathname;

  const handleNavClick = (e, targetPath) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-40 border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Name */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 group w-full sm:w-auto justify-center sm:justify-start"
        >
          <div className="bg-blue-600 group-hover:bg-blue-500 p-2 sm:p-2.5 rounded-xl text-white font-black shadow-md transition flex-shrink-0">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight my-0 text-white leading-tight">
                Smart Cataloged
              </h1>
              <span className="bg-blue-950 text-blue-300 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded border border-blue-800 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-blue-400" /> v2.0
              </span>
            </div>
            <p className="text-slate-400 text-xs font-medium tracking-wide">
              Official Store &amp; CEIT RAG Portal
            </p>
          </div>
        </a>

        {/* Navigation Buttons Container */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto">
          {currentPath !== '/ai' && (
            <a
              href="/ai"
              onClick={(e) => handleNavClick(e, '/ai')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5 sm:gap-2 border border-blue-500 focus:ring-2 focus:ring-blue-400 active:scale-95"
            >
              <Bot className="w-4 h-4 text-blue-200" /> CEIT AI Assistant
            </a>
          )}

          {currentPath === '/ai' && (
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm border border-slate-700 transition flex items-center gap-1.5 sm:gap-2 focus:ring-2 focus:ring-blue-400 active:scale-95"
            >
              <Store className="w-4 h-4 text-slate-400" /> Store Catalog
            </a>
          )}

          {currentPath === '/admin' ? (
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm border border-slate-700 transition flex items-center gap-1.5 sm:gap-2 focus:ring-2 focus:ring-blue-400 active:scale-95"
            >
              ← Back to Catalog
            </a>
          ) : isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <a
                href="/admin"
                onClick={(e) => handleNavClick(e, '/admin')}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition focus:ring-2 focus:ring-emerald-400 border border-emerald-600 flex items-center gap-1.5 sm:gap-2 active:scale-95"
              >
                <Unlock className="w-4 h-4" /> Admin Panel
              </a>
              <button
                onClick={onLogoutAdmin}
                className="bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-medium px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition focus:ring-2 focus:ring-rose-400 border border-rose-800 cursor-pointer active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/admin"
              onClick={(e) => handleNavClick(e, '/admin')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5 sm:gap-2 focus:ring-2 focus:ring-blue-400 active:scale-95"
            >
              <Lock className="w-4 h-4 text-slate-400" /> Admin Portal
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
