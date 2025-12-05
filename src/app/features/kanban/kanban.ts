import { Component, inject, signal, OnInit } from '@angular/core';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { KanbanColumn } from '../../shared/components/kanban-column/kanban-column';
import { Ticket } from '../../core/models/ticket';
import { CdkDrag, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanCard } from '../../shared/components/kanban-card/kanban-card';

interface KanColumn {
  title: string;
  tickets: Ticket[];
}
@Component({
  selector: 'app-kanban',
  imports: [KanbanColumn, CdkDrag, KanbanCard],
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

  onDrop(event: any) {
    if (event.previousContainer === event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
