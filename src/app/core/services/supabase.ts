import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { development } from '../../../environments/env';
import { User, CreateUserData } from '../models/user';
import { Ticket } from '../models/ticket';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase : SupabaseClient
  session : boolean = false

  private usersSubject = new BehaviorSubject<User[]>([]);
  users = this.usersSubject.asObservable();

  constructor() {
    this.supabase = createClient(
    development.supabase.authentication.SUPABASE_URL,
    development.supabase.authentication.SUPABASE_KEY
  );

}
  async registerAdmin(newAdmin: CreateUserData, email: string, password: string) {
    const { error, data } = await this.supabase.auth.signUp({ email, password });
    if (error)   throw error;
    const user = data.user;
    if (user) {
      await this.logiAdmin(email, password);
      newAdmin = await this.createUser({
        name: newAdmin.name,
        location: [],
        department_id: 0,
        role_id: 1,
        email: email
      })
    }
    return user;
  }

  async logiAdmin(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.session = true
    return data;
  }
 

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error)   throw error;
    
    this.session = false
  }

  async getTickets() {
    const { data, error } = await this.supabase.from('ticket').select('*');
    if (error)   throw error;
    
    return data as Ticket[];
  }

   async getUsers() {
    const {data, error} = await this.supabase.from('users').select('*');
    if (error)   throw error;
    
   this.usersSubject.next(data as User[]);
  }

  async createUser(user: CreateUserData) : Promise<User> {
    const { data, error } = await this.supabase.from('users').insert(user).select().single();
    if (error)   throw error;
   await this.getUsers();
   return data as User
  }
  async updateUser(user: CreateUserData, id: number ) : Promise<User> {
    const { data, error } = await this.supabase.from('users').update(user).eq('id', id).select().single();
    if (error)  throw error;
    await this.getUsers();
    return data as User
  }

  async deleteUser(id: number) : Promise<User> {
    const { data, error } = await this.supabase.from('users').delete().eq('id', id).select().single();
    if (error) 
      throw error;
  await this.getUsers();
   return data as User
  }
}
