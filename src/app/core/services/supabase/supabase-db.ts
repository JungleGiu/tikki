import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import { User } from '../../models/user';
import { Ticket, createTicketDTO, updateTicketDTO } from '../../models/ticket';
import { AppError } from '../errors/app-error';
import { ToastAppService } from '../toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {
  users = signal<User[]>([]);
  tickets = signal<Ticket[]>([]);

  constructor(private toastService: ToastAppService) {}

  async getTickets() {
    const { data, error } = await supabase.from('ticket').select('*');
    if (error) throw new AppError(error.code);
    this.tickets.set(data as Ticket[]);
    return data as Ticket[];
  }
  async getTicketById(id: string) {
    const { data, error } = await supabase.from('ticket').select('*').eq('id', id).single();
    if (error) throw new AppError(error.code);
    return data as Ticket;
  }

  async updateTicket(ticket: updateTicketDTO, id: string): Promise<Ticket> {
    try {
      const { error } = await supabase.from('ticket').update(ticket).eq('id', id);
      if (error) {
        throw new AppError(error.code);
      }
      const updatedTicket = await this.getTicketById(id);
      await this.getTickets();
      return updatedTicket;
    } catch (error) {
      console.error('Error in updateTicket:', error);
      throw error;
    }
  }

  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase.from('ticket').delete().eq('id', id);
    if (error) throw new AppError(error.code);
    await this.getTickets();
    this.toastService.showSuccess('Ticket deleted successfully');
  }
  async createTicket(ticket: createTicketDTO): Promise<Ticket> {
    const { error } = await supabase.from('ticket').insert(ticket);
    if (error) throw new AppError(error.code);
    const tickets = await this.getTickets();

    this.toastService.showSuccess('Ticket created successfully');
    return tickets[tickets.length - 1];
  }
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw new AppError(error.code);
    this.users.set(data as User[]);
    return data as User[];
  }

  async getUserById(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw new AppError(error.code);
    return data as User;
  }

  async updateUser(user: User, id: string): Promise<User> {
    const { error } = await supabase.from('users').update(user).eq('id', id);
    if (error) throw new AppError(error.code);
    const updatedUser = await this.getUserById(id);
    await this.getUsers();
    this.toastService.showSuccess('User updated successfully');
    return updatedUser;
  }

  async updateUserFromSelf(user: Partial<User>, id: string): Promise<User> {
    const { error } = await supabase.from('users').update(user).eq('id', id);
    if (error) throw new AppError(error.code);
    const updatedUser = await this.getUserById(id);
    await this.getUsers();
    this.toastService.showSuccess('User updated successfully');
    return updatedUser;
  }
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw new AppError(error.code);
    await this.getUsers();
    this.toastService.showSuccess('User deleted successfully');
  }
}
