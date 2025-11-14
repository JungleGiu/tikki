import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { development } from '../../../environments/env';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  
  supabase = createClient(
    development.supabase.authentication.SUPABASE_URL,
    development.supabase.authentication.SUPABASE_KEY
  );
  
}
