import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { LayoutDashboard, Calendar, Newspaper, Settings, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children, activeTab = 'events' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/admin/login';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/events', placeholder: true },
    { id: 'events', label: 'Events', icon: Calendar, href: '/admin/events', placeholder: false },
    { id: 'news', label: 'News', icon: Newspaper, href: '#', placeholder: true },
    { id: 'settings', label: 'Settings', icon: Settings, href: '#', placeholder: true },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b-4 border-sky-400 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-sky-300 hover:bg-slate-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>

            <a href="/admin/events" className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/images/logo.png"
                  alt="WYTU Logo"
                  className="h-12 w-auto object-contain bg-white/10 p-1 rounded-lg"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="bg-sky-400 text-slate-900 p-2 rounded-lg font-black flex items-center gap-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-wide text-white block leading-tight">
                  WYTU Admin
                </span>
                <span className="text-xs font-bold text-sky-300 tracking-wider uppercase">
                  Event Management System
                </span>
              </div>
            </a>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
              <div className="w-9 h-9 rounded-full bg-sky-500 text-slate-950 font-black flex items-center justify-center text-base">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-left text-xs">
                <p className="font-extrabold text-white">{user?.name || 'Admin User'}</p>
                <p className="text-sky-300 font-semibold">{user?.email || 'admin@wytu.edu'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-rose-700 hover:bg-rose-600 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2 cursor-pointer border border-rose-500"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm space-y-2 sticky top-28">
            <div className="px-3 py-2 text-xs font-black text-slate-400 uppercase tracking-wider">
              Management Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-extrabold text-base transition ${
                    isActive
                      ? 'bg-slate-900 text-sky-300 shadow-md border border-sky-400'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-sky-300' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.placeholder && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      Soon
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-lg space-y-2 mb-4">
            <div className="px-3 py-1 text-xs font-black text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-extrabold text-base ${
                    isActive
                      ? 'bg-slate-900 text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.placeholder && (
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
