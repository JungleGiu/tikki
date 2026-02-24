import { Component, inject, signal, OnInit, effect, OnDestroy } from '@angular/core';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { KanbanColumn } from '../../shared/components/kanban-column/kanban-column';
import { Ticket } from '../../core/models/ticket';
import { getCurrentTimestamp } from '../../shared/utils/date-utils';
import {
  CdkDrag,
  CdkDropListGroup,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { KanbanCard } from '../../shared/components/kanban-card/kanban-card';
import { updateTicketDTO } from '../../core/models/ticket';
import { KanbanAssign } from '../../shared/components/kanban-assign/kanban-assign';
import { AppError } from '../../core/services/errors/app-error';

interface KanColumn {
  title: string;
  tickets: Ticket[];
}
@Component({
  selector: 'app-kanban',
  imports: [KanbanColumn, KanbanCard, CdkDropList, CdkDropListGroup, KanbanAssign],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban implements OnInit, OnDestroy {
  supabaseAuth = inject(supabaseAuth);
  supabaseDb = inject(SupabaseDb);
  states = [0, 1, 2, 3];
  kanbanColumns = signal<Array<KanColumn>>([]);
  assignModalVisible = signal<boolean>(false);
  pendingTicket = signal<Ticket | null>(null);
  pendingNewStatus = signal<number | null>(null);
  isLocalUpdate = signal<boolean>(false);

  constructor() {
    // React to ticket changes and update kanban columns
    effect(() => {
      const tickets = this.supabaseAuth.tickets();
      this.updateKanbanColumns(tickets);
    });
  }

  async ngOnInit() {
    await this.supabaseDb.ticketsUpdatesListener((payload) => {
      this.handleTicketUpdate(payload);
    });
  }
  ngOnDestroy(): void {
    this.supabaseDb.unsubscribeFromTicketUpdates();
  }

  private handleTicketUpdate(payload: any) {
    if (this.isLocalUpdate()) {
      this.isLocalUpdate.set(false);
      return;
    }
    const eventType = payload.eventType;
    const currentTickets = this.supabaseAuth.tickets();
    let updatedTickets: Ticket[];

    if (eventType === 'INSERT') {
      // Add new ticket
      const newTicket = payload.new as Ticket;
      updatedTickets = [...currentTickets, newTicket];
    } else if (eventType === 'UPDATE') {
      // Update existing ticket
      const updatedTicket = payload.new as Ticket;
      updatedTickets = currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      );
    } else if (eventType === 'DELETE') {
      // Remove deleted ticket
      const deletedTicket = payload.old as Ticket;
      updatedTickets = currentTickets.filter((ticket) => ticket.id !== deletedTicket.id);
    } else {
      return;
    }

    this.supabaseAuth.tickets.set(updatedTickets);
  }

  private updateKanbanColumns(tickets: Ticket[]) {
    const appUser = this.supabaseAuth.appUser();
    const columns: Array<KanColumn> = this.states.map((state) => {
      const stateTickets = tickets.filter((ticket) => ticket.status === state);
      const sorted = stateTickets.sort((a, b) => {
        const aIsMyDept = appUser && a.department_id === appUser.department_id ? 0 : 1;
        const bIsMyDept = appUser && b.department_id === appUser.department_id ? 0 : 1;
        return aIsMyDept - bIsMyDept;
      });

      return {
        title: this.getStateTitle(state),
        tickets: sorted,
      };
    });
    this.kanbanColumns.set(columns);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    const { container, previousIndex, currentIndex, previousContainer } = event;
    const movedTicket = previousContainer.data[previousIndex];
    const appUser = this.supabaseAuth.appUser();
    if (!appUser || movedTicket.department_id !== appUser.department_id) {
      return;
    }
    if (container === previousContainer) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      return;
    }
    transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);
    const newStatus = this.states[container.id as unknown as number];
    if (movedTicket.status === newStatus) {
      return;
    }
    const isFromQueued = movedTicket.status === 0;
    const isToAssignedStatus = newStatus === 1 || newStatus === 2 || newStatus === 3;

    if (isFromQueued && isToAssignedStatus) {
      this.pendingTicket.set(movedTicket);
      this.pendingNewStatus.set(newStatus);
      this.assignModalVisible.set(true);
    } else {
      const assignedTo = newStatus === 0 ? null : movedTicket.assigned_to || null;
      this.updateTicketStatus(movedTicket, newStatus, assignedTo);
    }
  }

  private updateTicketStatus(ticket: Ticket, newStatus: number, assignedToUserId: string | null) {
    // Store original state for rollback
    const originalTickets = this.supabaseAuth.tickets();

    // Optimistically update UI immediately
    const updatedTicket = { ...ticket, status: newStatus, assigned_to: assignedToUserId };
    const optimisticTickets = originalTickets.map((t) => (t.id === ticket.id ? updatedTicket : t));
    this.supabaseAuth.tickets.set(optimisticTickets);

    this.isLocalUpdate.set(true);

    const updateData: updateTicketDTO = {
      status: newStatus,
      assigned_to: assignedToUserId,
      resolved_at: newStatus === 3 ? getCurrentTimestamp() : null,
    };

    this.supabaseDb
      .updateTicket(updateData, ticket.id)
      .catch((error) => {
        this.supabaseAuth.tickets.set(originalTickets);
        throw new AppError(error instanceof AppError ? error.code : 'UNKNOWN');
      })
      .catch(() => {
       
      });
  }

  onAssignConfirm(userId: string | null) {
    const pendingTicket = this.pendingTicket();
    const pendingStatus = this.pendingNewStatus();

    if (pendingTicket && pendingStatus !== null) {
      this.updateTicketStatus(pendingTicket, pendingStatus, userId);
    }
    this.assignModalVisible.set(false);
    this.pendingTicket.set(null);
    this.pendingNewStatus.set(null);
  }

  getStateTitle(state: number): string {
    switch (state) {
      case 0:
        return 'Queued';
      case 1:
        return 'Assigned';
      case 2:
        return 'In Progress';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }
}
