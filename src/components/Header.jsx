import React from 'react';
import { ShoppingBag, Lock, Unlock } from 'lucide-react';

export default function Header({ isAdminLoggedIn, onLogoutAdmin }) {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const isAdmin = currentPath === '/admin' || currentHash === '#/admin' || currentHash === '#admin';

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-40 border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-yellow-400 rounded-lg p-1">
          <div className="bg-yellow-400 p-2 rounded-xl text-blue-950 font-black">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight my-0 text-white leading-tight">
              Smart Cataloged
            </h1>
            <p className="text-yellow-300 text-sm font-semibold tracking-wide">
              Easy & Clear Product Store
            </p>
          </div>
        </a>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <a
              href="/"
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold px-5 py-3 rounded-xl text-lg shadow-md transition transform active:scale-95 focus:ring-4 focus:ring-yellow-300 border-2 border-yellow-500 flex items-center gap-2"
            >
              ← Back to Catalog
            </a>
          ) : isAdminLoggedIn ? (
            <div className="flex items-center gap-3">
              <a
                href="/admin"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-lg shadow-md transition focus:ring-4 focus:ring-yellow-300 border-2 border-emerald-400 flex items-center gap-2"
              >
                <Unlock className="w-5 h-5" /> Admin Panel
              </a>
              <button
                onClick={onLogoutAdmin}
                className="bg-red-700 hover:bg-red-600 text-white font-bold px-4 py-3 rounded-xl text-lg shadow-md transition focus:ring-4 focus:ring-yellow-300 border-2 border-red-500 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/admin"
              className="bg-blue-800 hover:bg-blue-700 text-yellow-300 font-bold px-4 py-3 rounded-xl text-base shadow-sm border border-blue-600 transition flex items-center gap-2 focus:ring-4 focus:ring-yellow-300"
            >
              <Lock className="w-5 h-5" /> Admin Portal
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
