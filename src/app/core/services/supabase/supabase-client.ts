
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { development } from '../../../../environments/env';

export const supabase =  createClient(
  development.supabase.authentication.SUPABASE_URL,
  development.supabase.authentication.SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

