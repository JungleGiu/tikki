import { Component, inject, OnInit, signal } from '@angular/core';
import { Ticket } from '../../../../core/models/ticket';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { TicketDetails } from '../../../../shared/components/ticket-details/ticket-details';
import { Searcher } from '../../../../shared/components/searcher/searcher';
import { SupabaseDb } from '../../../../core/services/supabase/supabase-db';
import { supabaseAuth } from '../../../../core/services/supabase/supabaseAuth';
import { AppError } from '../../../../core/services/errors/app-error';
import { ToastAppService } from '../../../../core/services/toast/toast-service';
import { ConfirmDeleteDialog } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog';
import { PaginationTool } from '../../../../shared/components/pagination-tool/pagination-tool';

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
  displayTickets = signal<Ticket[]>([]);
  ticketSelected = signal<Ticket | null>(null);
  isTicketDetailsVisible = signal<boolean>(false);
  deleteConfirmation = signal<boolean>(false);
  userId = this.auth.authUser()?.id;

  async ngOnInit() {
    const tickets = await this.database.getTickets();
    this.allTickets.set(tickets);
    this.displayTickets.set(tickets);
  }

  async onSelectEditTicket(ticket: Ticket) {
    this.ticketSelected.set(ticket);
    this.isTicketDetailsVisible.set(true);
  }

  closeTicketDetails() {
    this.isTicketDetailsVisible.set(false);
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
    // TODO: Implement delete ticket in database
    // await this.database.deleteTicket(id);
    // const tickets = await this.database.getTickets();
    // this.allTickets.set(tickets);
    // this.displayTickets.set(tickets);
  }

  onSearch(tickets: Ticket[]) {
    this.displayTickets.set(tickets);
  }
}
