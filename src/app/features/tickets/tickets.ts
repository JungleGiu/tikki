import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Ticket } from '../../core/models/ticket';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TicketDetails } from '../../shared/components/ticket-details/ticket-details';
import { Searcher } from '../../shared/components/searcher/searcher';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { AppError } from '../../core/services/errors/app-error';
import { ToastAppService } from '../../core/services/toast/toast-service';
import { ConfirmDeleteDialog } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog';
import { PaginationTool } from '../../shared/components/pagination-tool/pagination-tool';

@Component({
  selector: 'app-tickets',
  imports: [DataTable, ConfirmDeleteDialog, PaginationTool, TicketDetails, Searcher],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets implements OnInit {
  database = inject(SupabaseDb);
  toast = inject(ToastAppService);
  auth = inject(supabaseAuth);
  allTickets = signal<Ticket[]>([]);
  roleFilteredTickets = signal<Ticket[]>([]);
  searchResultTickets = signal<Ticket[]>([]);
  displayTickets = signal<Ticket[]>([]);
  searchResultFollowedTickets = signal<Ticket[]>([]);
  displayFollowedTickets = signal<Ticket[]>([]);
  ticketSelected = signal<Ticket | null>(null);
  isTicketDetailsVisible = signal<boolean>(false);
  ticketdetailsMode = signal<'create' | 'edit' | 'view'>('view');
  deleteConfirmation = signal<boolean>(false);
  followedTickets = signal<Ticket[]>([]);
  userId = this.auth.authUser()?.id;
  userRole = this.auth.appUser()?.role_id;
  userDepartment = this.auth.appUser()?.department_id;

  constructor() {
    effect(() => {
      // Sync with auth service tickets whenever they change
      const tickets = this.auth.tickets();
      this.allTickets.set(tickets);
      const roleFiltered = this.applyRoleFilter(tickets);
      this.roleFilteredTickets.set(roleFiltered);
      this.searchResultTickets.set(roleFiltered);
      this.followedTickets.set(
        tickets.filter(
          (ticket) =>
            ticket.created_by === this.userId && ticket.department_id !== this.userDepartment
        )
      );
      this.searchResultFollowedTickets.set(this.followedTickets());
    });
  }

  private applyRoleFilter(tickets: Ticket[]): Ticket[] {
    if (this.userRole === 0) {
      return tickets;
    } else if (this.userRole === 1) {
      return tickets.filter((t) => t.department_id === this.userDepartment);
    } else if (this.userRole === 2) {
      return tickets.filter((t) => t.assigned_to === this.userId);
    }
    return [];
  }

  async ngOnInit() {
    const tickets = await this.database.getTickets();
    this.auth.tickets.set(tickets);
  }

  async onSelectEditTicket(ticket: Ticket) {
    this.ticketSelected.set(ticket);
    this.ticketdetailsMode.set('view');
    this.isTicketDetailsVisible.set(true);
  }

  openCreateDialog() {
    this.ticketSelected.set(null);
    this.isTicketDetailsVisible.set(true);
    this.ticketdetailsMode.set('create');
  }

  closeTicketDetails() {
    this.isTicketDetailsVisible.set(false);
    this.ticketdetailsMode.set('view');
    this.ticketSelected.set(null);
  }

  async onDeleteTicket(id: string) {
    this.deleteConfirmation.set(true);
    this.ticketSelected.set(this.allTickets()?.find((ticket) => ticket.id === id) ?? null);
  }

  async onDeleteConfirm(id: string) {
    if (id === '') {
      throw new AppError('TICKET_NOT_FOUND');
    }
    this.deleteConfirmation.set(false);
    await this.database.deleteTicket(id);
    const tickets = await this.database.getTickets();
    this.auth.tickets.set(tickets);
  }

  async rechargeTickets() {
    try {
      const tickets = await this.database.getTickets();
      this.auth.tickets.set(tickets);
      this.closeTicketDetails();
    } catch (error) {
      throw new AppError('DATA_FETCH_FAILED');
    }
  }
}
