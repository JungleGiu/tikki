import { computed, Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import type { Session } from '@supabase/supabase-js';
import { User, Company } from '../../models/user';
import { AppError } from '../errors/app-error';
import { development } from '../../../../environments/env';
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
       options: {
    data: {
      role_id: 0
    }
  }
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
  // async loginMagicLink(user: User) {
  //   const company = this.appUser();
  //   const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
  //     type: 'magiclink',
  //     email: user.email,
  //     options: {
  //       redirectTo: `${development.baseURL}/onboarding`,
  //       data: {
  //         orgName: company?.name,
  //       },
  //     },
  //   });
  //   if (linkError) throw new AppError(linkError.code ?? '');

  //   const authId = link.user?.id;
  //   if (!authId) {
  //     throw new AppError('AUTH_FAILED');
  //   }
  //   const { data, error } = await supabase
  //     .from('users')
  //     .insert({ id: authId, ...user, created_by: company?.id })
  //     .select()
  //     .single();
  //   if (error) throw new AppError(error.code);

  //   return data as User;
  // }

  async createUserViaFunction(userData: User) {
  const { data, error } = await this.supabaseAuth.functions.invoke('create-user-company', {
    body: { email: userData.email }
  });

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  const { error: insertError } = await this.supabaseAuth
    .from('users')
    .insert({
      id: data.userId,
      name: userData.name,
      email: userData.email,
      role_id: userData.role_id,
      department_id: userData.department_id,
      location: userData.location,
      created_by: userData.created_by
    });

  if (insertError) {
    throw new Error(`Insert failed: ${insertError.message}`);
  }

  // 🚀 Opzionale: Invia l'email tu stesso con il link
  if (data.inviteLink) {
    await this.sendInviteEmail(userData.email, data.inviteLink);
  }

  return { success: true, userId: data.userId, inviteLink: data.inviteLink };
}

private async sendInviteEmail(email: string, inviteLink: string) {
  // Usa il tuo servizio email (Resend, SendGrid, Mailgun, etc.)
  // Oppure mostra il link all'utente per copiarlo manualmente
  console.log(`📧 Send this invite link to ${email}: ${inviteLink}`);
}
  async logout() {
    const { error } = await this.supabaseAuth.auth.signOut();
    if (error && error.code) throw new AppError(error.code);
    this.sessionSignal.set(null);
    this.appUser.set(null);
  }
}
