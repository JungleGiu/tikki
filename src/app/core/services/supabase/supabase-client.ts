
import { createClient } from '@supabase/supabase-js';
import { development } from '../../../../environments/env';

export const initializeSupabase = () => {
  const url = development.supabase.authentication.SUPABASE_URL;
  const key = development.supabase.authentication.SUPABASE_KEY;
  if (!url || url.trim() === '') {
    throw new Error('Supabase URL is required');
  }

  if (!key || key.trim() === '') {
    throw new Error('Supabase key is required');
  }


  return createClient(url, key,  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export const supabase =  initializeSupabase();

