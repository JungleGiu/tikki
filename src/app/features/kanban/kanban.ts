import { Component, inject, signal, OnInit } from '@angular/core';
import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { KanbanColumn } from '../../shared/components/kanban-column/kanban-column';
import { Ticket } from '../../core/models/ticket';
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
interface KanColumn {
  title: string;
  tickets: Ticket[];
}
@Component({
  selector: 'app-kanban',
  imports: [KanbanColumn, CdkDrag, KanbanCard, CdkDropList, CdkDropListGroup, KanbanAssign],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban implements OnInit {
  supabaseAuth = inject(supabaseAuth);
  supabaseDb = inject(SupabaseDb);
  states = [0, 1, 2, 3];
  kanbanColumns = signal<Array<KanColumn>>([]);
  assignModalVisible = signal<boolean>(false);
  pendingTicket = signal<Ticket | null>(null);
  pendingNewStatus = signal<number | null>(null);

  ngOnInit() {
    const tickets = this.supabaseAuth.tickets();
    const columns: Array<KanColumn> = this.states.map((state) => ({
      title: this.getStateTitle(state),
      tickets: tickets.filter((ticket) => ticket.status === state),
    }));
    this.kanbanColumns.set(columns);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    const { container, previousIndex, currentIndex, previousContainer } = event;

    if (container === previousContainer) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      return;
    }

    transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);

    const movedTicket = container.data[currentIndex];
    const newStatus = this.states[container.id as unknown as number];

    if (movedTicket.status === newStatus) {
      return;
    }

    // Show assignment modal only when moving FROM Queued (0) TO an assigned status (1, 2, 3)
    const isFromQueued = movedTicket.status === 0;
    const isToAssignedStatus = newStatus === 1 || newStatus === 2 || newStatus === 3;

    console.log('Drop event:', {
      ticketId: movedTicket.id,
      ticketStatus: movedTicket.status,
      newStatus,
      isFromQueued,
      isToAssignedStatus,
    });

    if (isFromQueued && isToAssignedStatus) {
      // Moving from Queued to an assigned status - prompt for assignment
      console.log('Showing modal');
      this.pendingTicket.set(movedTicket);
      this.pendingNewStatus.set(newStatus);
      this.assignModalVisible.set(true);
    } else {
      // For other status changes, update directly
      // When moving to Queued, unassign the ticket (set assigned_to to null)
      const assignedTo = newStatus === 0 ? null : movedTicket.assigned_to || null;
      this.updateTicketStatus(movedTicket, newStatus, assignedTo);
    }
  }

  private updateTicketStatus(ticket: Ticket, newStatus: number, assignedToUserId: string | null) {
    const updateData: updateTicketDTO = {
      status: newStatus,
      assigned_to: assignedToUserId,
      resolved_at: newStatus === 3 ? new Date().toISOString() : null,
    };

    this.supabaseDb.updateTicket(updateData, ticket.id).catch((error) => {
      console.error('Error updating ticket status:', error);
      // Revert the UI change by reloading columns
      const tickets = this.supabaseAuth.tickets();
      const columns: Array<KanColumn> = this.states.map((state) => ({
        title: this.getStateTitle(state),
        tickets: tickets.filter((ticket) => ticket.status === state),
      }));
      this.kanbanColumns.set(columns);
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
