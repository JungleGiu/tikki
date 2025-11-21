import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import { User } from '../../models/user';
import { Ticket } from '../../models/ticket';
import { AppError } from '../errors/app-error';
@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {

  async getTickets() {
    const { data, error } = await supabase.from('ticket')
    .select('*');
    if (error) throw new AppError(error.code);

    return data as Ticket[];
  }

  async getUsers() {
    const { data, error } = await supabase.from('users')
    .select('*');
    if (error) throw new AppError(error.code);

    return data as User[];
  }

  async createUser(user: User): Promise<User> {
    const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
    if (error) throw new AppError(error.code);
    await this.getUsers();
    return data as User;
  }

  async updateUser(user: User, id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(error.code);
    await this.getUsers();
    return data as User;
  }

  async deleteUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(error.code);
    await this.getUsers();
    return data as User;
  }
}
