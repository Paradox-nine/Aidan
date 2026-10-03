import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError('Please enter your Email or Username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (trimmedIdentifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)) {
      setError('Please enter a valid email format (e.g. admin@wytu.edu).');
      return;
    }

    setLoading(true);
    try {
      await authService.login({
        email: trimmedIdentifier.includes('@') ? trimmedIdentifier : undefined,
        username: !trimmedIdentifier.includes('@') ? trimmedIdentifier : undefined,
        password,
        rememberMe,
      });

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = '/admin/events';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* WYTU Logo & Header */}
        <div className="flex justify-center mb-4">
          {!imageError ? (
            <img
              src="/images/logo.png"
              alt="WYTU Logo"
              className="h-20 w-auto object-contain drop-shadow-md"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="bg-sky-500 text-slate-900 p-4 rounded-2xl flex items-center gap-2 shadow-lg font-black text-2xl">
              <ShieldCheck className="w-10 h-10" />
              <span>WYTU ADMIN</span>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight">
          WYTU Portal Admin Login
        </h2>
        <p className="mt-2 text-base font-semibold text-sky-200">
          West Yangon Technological University — Event Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border-4 border-sky-400">
          {error && (
            <div className="mb-6 bg-rose-50 border-2 border-rose-400 text-rose-900 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email / Username Field */}
            <div>
              <label htmlFor="identifier" className="block text-base font-black text-slate-900 mb-1">
                Email / Username <span className="text-rose-600">*</span>
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@wytu.edu or username"
                className="w-full text-lg font-bold p-3.5 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-base font-black text-slate-900 mb-1">
                Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-lg font-bold p-3.5 pr-12 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none bg-slate-50 text-slate-900"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-sky-600 border-2 border-slate-400 rounded focus:ring-sky-400 cursor-pointer"
                />
                <span className="text-sm font-extrabold text-slate-700">Remember Me</span>
              </label>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-sky-300 font-black text-xl py-4 rounded-xl border-2 border-sky-500 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition focus:ring-4 focus:ring-sky-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-sky-300" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Login to Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Demo Environment — Development Auth Abstraction Service Ready for Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
