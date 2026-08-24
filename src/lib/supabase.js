import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xfevlbotbisvnrwfnzzn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zKh4z-1X9fyjYyV9cyJ8WA_qVFdl9fE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
