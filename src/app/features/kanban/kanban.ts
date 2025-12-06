import { Component, inject, signal, OnInit } from '@angular/core';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { KanbanColumn } from '../../shared/components/kanban-column/kanban-column';
import { Ticket } from '../../core/models/ticket';
import { CdkDrag, CdkDropListGroup, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanCard } from '../../shared/components/kanban-card/kanban-card';

interface KanColumn {
  title: string;
  tickets: Ticket[];
}
@Component({
  selector: 'app-kanban',
  imports: [KanbanColumn, CdkDrag, KanbanCard, CdkDropList, CdkDropListGroup],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban implements OnInit {
  supabaseDb = inject(SupabaseDb);
  states = [0, 1, 2, 3];
  kanbanColumns = signal<Array<KanColumn>>([]);

  async ngOnInit() {
    const tickets = await this.supabaseDb.getTickets();
    const columns: Array<KanColumn> = this.states.map((state) => ({
      title: this.getStateTitle(state),
      tickets: tickets.filter((ticket) => ticket.status === state),
    }));
    this.kanbanColumns.set(columns);
  }

drop(event: CdkDragDrop<Ticket[]>) {
  const { container, previousIndex, currentIndex, previousContainer} = event;

  if (container === previousContainer) {
    moveItemInArray(container.data, previousIndex, currentIndex);
    
  }else {
  transferArrayItem(
      previousContainer.data,
      container.data,
      previousIndex,
      currentIndex
    );

    const movedTicket = container.data[currentIndex];
    const newStatus = this.states[container.id as unknown as number];

    this.supabaseDb.updateTicket( { status: newStatus }, movedTicket.id!)
      .catch((error) => {
        console.error('Error updating ticket status:', error);
        transferArrayItem(
          container.data,
          previousContainer.data,
          currentIndex,
          previousIndex
        );
      });
    };
 
 
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
