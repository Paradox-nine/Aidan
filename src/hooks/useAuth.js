import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_USER_KEY = 'smart_catalog_demo_admin_user';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check demo user persistence in localStorage
      try {
        const saved = localStorage.getItem(DEMO_USER_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error reading demo user:', e);
      }
      setLoading(false);
      return;
    }

    // Supabase auth state listener
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error('Supabase session fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) {
      const demoUser = { email, id: 'demo-admin-id', role: 'admin' };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
    setUser(null);
  };

  return {
    user,
    loading,
    isAdmin: Boolean(user),
    loginWithEmail,
    logout
  };
}
