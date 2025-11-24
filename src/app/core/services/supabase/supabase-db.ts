import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import { User } from '../../models/user';
import { Ticket } from '../../models/ticket';
import { AppError } from '../errors/app-error';
import { ToastAppService } from '../toast/toast-service';
import { supabaseAuth } from './supabaseAuth';
import { development } from '../../../../environments/env';
@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {
users = signal<User[]>([]);
tickets = signal<Ticket[]>([]);
company :any = {}
constructor(private toastService : ToastAppService) {
this.company = supabaseAuth
}
  async getTickets() {
    const { data, error } = await supabase.from('ticket')
    .select('*');
    if (error) throw new AppError(error.code);
    this.tickets.set(data as Ticket[]);
    return data as Ticket[];
  }

  async getUsers() {
    const { data, error } = await supabase.from('users')
    .select('*');
    if (error) throw new AppError(error.code);
    this.users.set(data as User[]);
    return data as User[];
  }

  async getAuthUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new AppError(error.code);
    return data as User;
  }
  async createUser(user: User): Promise<User> {
    const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
    if (error) throw new AppError(error.code);
   
 const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
     type: 'magiclink',
      email: user.email,
      options: {
        redirectTo:`${development.baseURL}/onboarding`,
        // data: {
        //   orgName : this.company.appUser.name},
        },
      });
      if (linkError) throw new AppError(linkError.code?? '');
    await this.getUsers();
    this.toastService.showSuccess('User created successfully');
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
    this.toastService.showSuccess('User updated successfully');
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
    this.toastService.showSuccess('User deleted successfully');
    return data as User;
  }
}
