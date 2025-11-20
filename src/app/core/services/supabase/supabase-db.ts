import { Injectable, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { development } from '../../../../environments/env';
import { User } from '../../models/user';
import { Ticket } from '../../models/ticket';
@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {
  private supabaseDB: SupabaseClient;

  constructor() {
    this.supabaseDB = createClient(
      development.supabase.storage.SUPABASE_URL,
      development.supabase.storage.SUPABASE_KEY
    );
  }
  async getTickets() {
    const { data, error } = await this.supabaseDB.from('ticket')
    .select('*');
    if (error) throw error;

    return data as Ticket[];
  }

  async getUsers() {
    const { data, error } = await this.supabaseDB.from('users')
    .select('*');
    if (error) throw error;

    return data as User[];
  }

  async createUser(user: User): Promise<User> {
    const { data, error } = await this.supabaseDB
    .from('users')
    .insert(user)
    .select()
    .single();
    if (error) throw error;
    await this.getUsers();
    return data as User;
  }

  async updateUser(user: User, id: string): Promise<User> {
    const { data, error } = await this.supabaseDB
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await this.getUsers();
    return data as User;
  }

  async deleteUser(id: string): Promise<User> {
    const { data, error } = await this.supabaseDB
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await this.getUsers();
    return data as User;
  }
}
