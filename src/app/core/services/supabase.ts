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
  

  async register(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
    return data;
  }

  async login(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    return data;
  }
 
}
