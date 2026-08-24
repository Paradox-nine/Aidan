import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
                    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
                    'sb_publishable_zKh4z-1X9fyjYyV9cyJ8WA_qVFdl9fE';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Create Supabase client instance (or fallback client if URL isn't set yet)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey
);
