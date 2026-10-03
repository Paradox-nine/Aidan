import { LoginCredentials, User } from '../types/event';

/**
 * Development / Mock Authentication Service
 * ----------------------------------------
 * NOTE: This is a frontend demonstration implementation only.
 * When Supabase Auth is integrated in the future, replace these methods with:
 *   - supabase.auth.signInWithPassword()
 *   - supabase.auth.signOut()
 *   - supabase.auth.getUser()
 *
 * Do NOT store production secrets or rely on frontend validation for real security.
 */

const MOCK_USER: User = {
  id: 'usr_admin_wytu_01',
  email: 'admin@wytu.edu',
  name: 'WYTU Admin',
  role: 'admin',
};

const AUTH_STORAGE_KEY = 'wytu_admin_session';

export const authService = {
  /**
   * Log in user with credentials.
   * Resolves on success, rejects with Error on validation or credential failure.
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const identifier = (credentials.email || credentials.username || '').trim();
    const password = credentials.password || '';

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!identifier) {
      throw new Error('Email or Username is required.');
    }

    if (!password) {
      throw new Error('Password is required.');
    }

    // Email format check if @ is present
    if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      throw new Error('Please enter a valid email address.');
    }

    // Development demo check (Accepts any non-empty input or dev credentials)
    // To replace with Supabase Auth `supabase.auth.signInWithPassword({ email, password })`
    const sessionData = JSON.stringify({
      user: {
        ...MOCK_USER,
        email: identifier.includes('@') ? identifier : 'admin@wytu.edu',
      },
      token: 'dev_mock_jwt_token_' + Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (credentials.rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, sessionData);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, sessionData);
    }

    return {
      ...MOCK_USER,
      email: identifier.includes('@') ? identifier : 'admin@wytu.edu',
    };
  },

  /**
   * Logs out the current admin session.
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Retrieves the current authenticated admin user or null.
   */
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed?.expiresAt && parsed.expiresAt < Date.now()) {
        this.logout();
        return null;
      }
      return parsed?.user || null;
    } catch {
      return null;
    }
  },

  /**
   * Returns true if user is currently logged in.
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
