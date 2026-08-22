import React, { useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  isConfigured 
} from '../firebase';
import { X, Lock, Mail, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ isOpen, onClose, onLoginSuccess, onDemoLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    if (!isConfigured) {
      // Demo authentication mode when Firebase config contains placeholders
      setTimeout(() => {
        onDemoLogin({ email, uid: 'demo-admin-id', displayName: email.split('@')[0] });
        setLoading(false);
        onClose();
      }, 500);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user);
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials provided.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to multiple failed login attempts.');
      } else {
        setError(err.message || 'Failed to authenticate.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    if (!isConfigured) {
      setTimeout(() => {
        onDemoLogin({ email: 'admin@codingclub.dev', uid: 'demo-google-admin', displayName: 'Admin User' });
        setLoading(false);
        onClose();
      }, 500);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLoginSuccess(result.user);
      onClose();
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google Sign-In failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <Lock size={20} />
            </div>
            <h3>Admin Portal Access</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {!isConfigured && (
            <div className="demo-notice banner-warning">
              <ShieldCheck size={18} />
              <div>
                <strong>Demo Mode Active:</strong> Firebase credentials are placeholders. Submitting or clicking Google Login will enter local Admin session for preview.
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@codingclub.dev"
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
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
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

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button 
            onClick={handleGoogleSignIn} 
            className="btn btn-google btn-full"
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
