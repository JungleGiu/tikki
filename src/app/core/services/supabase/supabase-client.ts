
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment.development';

export const initializeSupabase = () => {
  const url = environment.SUPABASE_URL;
  const key = environment.SUPABASE_KEY;
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

