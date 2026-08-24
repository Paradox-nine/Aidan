import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_zKh4z-1X9fyjYyV9cyJ8WA_qVFdl9fE';

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseKey);
