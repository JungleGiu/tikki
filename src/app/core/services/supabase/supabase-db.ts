import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import { User } from '../../models/user';
import { Ticket, createTicketDTO, updateTicketDTO } from '../../models/ticket';
import { AppError } from '../errors/app-error';
import { ToastAppService } from '../toast/toast-service';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {
  private ticketsUpdatesChannel: RealtimeChannel | null = null;

  constructor(private toastService: ToastAppService) {}

  async ticketsUpdatesListener(onChange: (payload: any) => void): Promise<void> {
    if (this.ticketsUpdatesChannel) {
      await supabase.removeChannel(this.ticketsUpdatesChannel);
    }
    try {
      this.ticketsUpdatesChannel = await supabase
        .channel('tickets-updates')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'ticket' },
          (payload) => {
            onChange(payload);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'ticket' },
          (payload) => {
            onChange(payload);
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'ticket' },
          (payload) => {
            onChange(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to tickets updates channel');
          }
        });
    } catch (error) {
      console.error('Error in ticketsUpdatesListener:', error);
    }
  }
  async unsubscribeFromTicketUpdates(): Promise<void> {
    if (this.ticketsUpdatesChannel) {
      await supabase.removeChannel(this.ticketsUpdatesChannel);
      this.ticketsUpdatesChannel = null;
    }
  }
  async getTickets() {
    const { data, error } = await supabase.from('ticket').select('*');
    if (error) throw new AppError(error.code);

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
      throw new AppError(error instanceof AppError ? error.code : 'UNKNOWN');
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
