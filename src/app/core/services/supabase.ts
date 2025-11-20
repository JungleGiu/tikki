import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import { development } from '../../../environments/env';
import { User, Company } from '../models/user';
import { Ticket } from '../models/ticket';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;
  sessionSignal = signal<Session | null>(null);
  authUser = computed(() => this.sessionSignal()?.user ?? null);
  appUser = signal<User | null>(null);
  private usersSubject = new BehaviorSubject<User[]>([]);
  users = this.usersSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      development.supabase.authentication.SUPABASE_URL,
      development.supabase.authentication.SUPABASE_KEY
    );
    this.supabase.auth.getSession().then(({ data }) => {
      this.sessionSignal.set(data.session);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSignal.set(session);
      if (session?.user) {
        this.loadAppUser(session.user.id);
      } else {
        this.appUser.set(null);
      }
    });
  }

  async loadAppUser(id: string) {
    const { data } = await this.supabase.from('users').select('*').eq('id', id).single();

    this.appUser.set(data ?? null);
  }

  async registerCompany(company: Company, email: string, password: string) {
    const { error: signUperror, data: signUpData } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (signUperror) throw signUperror;

    const { user } = signUpData;
    //  Sign in automatically only works if email confirmation is OFF!!
    const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;

    company.id = signInData.user.id;
    company.created_at = signInData.user.created_at;

    const { data: tableUserData, error: tableInsertError } = await this.supabase
      .from('users')
      .insert(company)
      .select()
      .single();

    if (tableInsertError) throw tableInsertError;

    return tableUserData;
  }

  async logiAdmin(email: string, password: string) {
    const { error, data } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: userData, error: insertError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (insertError) throw insertError;

    return userData;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.sessionSignal.set(null);
    this.appUser.set(null);
  }

  async getTickets() {
    const { data, error } = await this.supabase.from('ticket').select('*');
    if (error) throw error;

    return data as Ticket[];
  }

  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) throw error;

    this.usersSubject.next(data as User[]);
  }

  async createUser(user: User): Promise<User> {
    const { data, error } = await this.supabase.from('users').insert(user).select().single();
    if (error) throw error;
    await this.getUsers();
    return data as User;
  }

  async updateUser(user: User, id: string): Promise<User> {
    const { data, error } = await this.supabase
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
    const { data, error } = await this.supabase
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
