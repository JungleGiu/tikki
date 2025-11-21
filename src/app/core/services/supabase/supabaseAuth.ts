import { computed, Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import type { Session } from '@supabase/supabase-js';
import { User, Company } from '../../models/user';
import { AppError } from '../errors/app-error';
@Injectable({
  providedIn: 'root',
})
export class supabaseAuth {
  supabaseAuth = supabase;
  sessionSignal = signal<Session | null>(undefined as any);
  authUser = computed(() => this.sessionSignal()?.user ?? null);
  appUser = signal<User | null>(null);
  isInitialized = signal(false);
  constructor() {
    this.supabaseAuth.auth
      .getSession()
      .then(({ data }) => {
        this.sessionSignal.set(data.session);
        this.isInitialized.set(true);
      })
      .catch((error) => {
        console.error(error);
        throw new AppError(error.code);
      });
    this.supabaseAuth.auth.onAuthStateChange((_event, session) => {
      this.sessionSignal.set(session);
      this.isInitialized.set(true);
      if (session?.user) {
        this.loadAppUser(session.user.id);
      } 
    });
  }

  async loadAppUser(id: string) {
    const { data } = await this.supabaseAuth.from('users').select('*').eq('id', id).single();
    this.appUser.set(data ?? null);
  }

  async registerCompany(company: Company, email: string, password: string) {
    const { error: signUperror } = await this.supabaseAuth.auth.signUp({
      email,
      password,
    });
    if (signUperror && signUperror.code) {
      throw new AppError(signUperror.code);
    }
    //  Sign in automatically only works if email confirmation is OFF!!
    const { data: signInData, error: signInError } =
      await this.supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
    if (signInError && signInError.code) {
      throw new AppError(signInError.code);
    }

    if (!signInData.user) {
      throw new AppError('AUTH_FAILED');
    }

    company.id = signInData.user.id;
    company.created_at = signInData.user.created_at;

    const { data: tableUserData, error: tableInsertError } = await this.supabaseAuth
      .from('users')
      .insert(company)
      .select()
      .single();

    if (tableInsertError) throw new AppError('INSERT_FAILED');

    return tableUserData;
  }

  async logiAdmin(email: string, password: string) {
    const { error, data } = await this.supabaseAuth.auth.signInWithPassword({ email, password });
    if (error && error.code) throw new AppError(error.code);

    const { data: userData, error: insertError } = await this.supabaseAuth
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    if (insertError) throw new AppError('INSERT_FAILED');

    return userData;
  }

  async logout() {
    const { error } = await this.supabaseAuth.auth.signOut();
    if (error && error.code) throw new AppError(error.code);
    this.sessionSignal.set(null);
    this.appUser.set(null);
  }
}
