import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local demo session check if Supabase is not fully configured
    const savedDemoUser = localStorage.getItem('smart_catalog_admin_session');
    if (savedDemoUser) {
      try {
        setUser(JSON.parse(savedDemoUser));
      } catch {
        setUser(null);
      }
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active session from Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) {
      const demoUser = { email, uid: 'demo-admin-id', role: 'admin' };
      setUser(demoUser);
      localStorage.setItem('smart_catalog_admin_session', JSON.stringify(demoUser));
      return { user: demoUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    setUser(data.user);
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('smart_catalog_admin_session');
  };

  return {
    user,
    loading,
    loginWithEmail,
    logout,
    isAuthenticated: Boolean(user)
  };
}
