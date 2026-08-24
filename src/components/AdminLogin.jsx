import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { X, Lock, Mail, KeyRound, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ isOpen, onClose, onLogin, error: propError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      await onLogin(email, password);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login credentials.');
      setLoading(false);
    }
  };

  const displayError = error || propError;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <Lock size={20} />
            </div>
            <h3>Admin Portal Sign In</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {!isSupabaseConfigured && (
            <div className="demo-notice banner-warning">
              <ShieldCheck size={18} />
              <div>
                <strong>Demo Auth Mode:</strong> Supabase credentials not set in <code>.env</code>. Logging in will enter a local demo session.
              </div>
            </div>
          )}

          {displayError && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@smartcatalog.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
