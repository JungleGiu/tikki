import { Component, inject, Input } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { Badge } from '../badge/badge';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { DatePipe, NgClass } from '@angular/common';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { CdkDrag } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-kanban-card',
  imports: [Badge, DepartmentPipePipe, PriorityPipe, UserNamePipe, DatePipe, NgClass, CdkDrag],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.scss',
})
export class KanbanCard {
  @Input() ticket!: Ticket;
  auth = inject(supabaseAuth);

  isMydept(): boolean {
    const appUser = this.auth.appUser();
    if (!appUser) {
      return false;    
    }
    return appUser.department_id === this.ticket.department_id;
  }

  isDraggable(): boolean {
    return this.isMydept();
  }
}
