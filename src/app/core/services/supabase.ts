import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { development } from '../../../environments/env';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase : SupabaseClient
  constructor() {
    this.supabase = createClient(
    development.supabase.authentication.SUPABASE_URL,
    development.supabase.authentication.SUPABASE_KEY
  );
}

  async registerAdmin(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
    return data;
  }

  async logiAdmin(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    return data;
  }
 

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getTickets() {
    const { data, error } = await this.supabase.from('tickets').select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async getUsers() : Promise<User[]> {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async createUser(user: User) {
    const { data, error } = await this.supabase.from('users').insert(user);
    if (error) {
      throw error;
    }
    return data;
  }
  async updateUser(user: User) {
    const { data, error } = await this.supabase.from('users').update(user).eq('id', user.id);
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteUser(id: number) {
    const { data, error } = await this.supabase.from('users').delete().eq('id', id);
    if (error) {
      throw error;
    }
    return data;
  }

}
