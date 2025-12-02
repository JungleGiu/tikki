import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase-client';
import { User } from '../../models/user';
import { Ticket } from '../../models/ticket';
import { AppError } from '../errors/app-error';
import { ToastAppService } from '../toast/toast-service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDb {
  users = signal<User[]>([]);
  tickets = signal<Ticket[]>([]);

  constructor(private toastService: ToastAppService) {}

  private parseTickets(tickets: any[]): Ticket[] {
    return tickets.map((ticket) => ({
      ...ticket,
      location: typeof ticket.location === 'string' ? JSON.parse(ticket.location) : ticket.location,
    }));
  }

  private parseTicket(ticket: any): Ticket {
    return {
      ...ticket,
      location: typeof ticket.location === 'string' ? JSON.parse(ticket.location) : ticket.location,
    };
  }
  async getTickets() {
    const { data, error } = await supabase.from('ticket').select('*');
    if (error) throw new AppError(error.code);
    const parsedTickets = this.parseTickets(data || []);
    this.tickets.set(parsedTickets);
    return parsedTickets;
  }
  async getTicketById(id: string) {
    const { data, error } = await supabase.from('ticket').select('*').eq('id', id).single();
    if (error) throw new AppError(error.code);
    return this.parseTicket(data);
  }

  async updateTicket(ticket: Partial<Ticket> | Ticket, id: string): Promise<Ticket> {

    const ticketData = { ...ticket };

  
    if (ticketData.location && typeof ticketData.location === 'object') {
      ticketData.location = JSON.stringify(ticketData.location) as any;
    }

    const { data, error } = await supabase
      .from('ticket')
      .update(ticketData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(error.code);
    await this.getTickets();
    this.toastService.showSuccess('Ticket updated successfully');
    return this.parseTicket(data);
  }

  async deleteTicket(id: string): Promise<Ticket> {
    const { data, error } = await supabase.from('ticket').delete().eq('id', id).select().single();
    if (error) throw new AppError(error.code);
    await this.getTickets();
    this.toastService.showSuccess('Ticket deleted successfully');
    return data as Ticket;
  }
  async createTicket(ticket: Ticket): Promise<Ticket> {
    const { data, error } = await supabase.from('ticket').insert(ticket).select().single();
    if (error) throw new AppError(error.code);
    await this.getTickets();
    this.toastService.showSuccess('Ticket created successfully');
    return data as Ticket;
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

  async updateUserFromSelf(user: Partial<User>, id: string): Promise<User> {
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
    const { data, error } = await supabase.from('users').delete().eq('id', id).select().single();
    if (error) throw new AppError(error.code);
    await this.getUsers();
    this.toastService.showSuccess('User deleted successfully');
    return data as User;
  }
}
