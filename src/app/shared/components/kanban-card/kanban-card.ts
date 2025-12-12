import { Component, inject, Input } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { Badge } from '../badge/badge';
import { DepartmentPipe } from '../../pipes/department-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { DatePipe, NgClass } from '@angular/common';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { CdkDrag } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-kanban-card',
  imports: [Badge, DepartmentPipe, PriorityPipe, UserNamePipe, DatePipe, NgClass, CdkDrag],
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

  isAssignedToMe(): boolean {
    const appUser = this.auth.appUser();
    if (!appUser) {
      return false;
    }

    return this.ticket.assigned_to === appUser.id;
  }
  isDraggable(): boolean {
    const appUser = this.auth.appUser();
    if (!appUser) return false;

    if (appUser.role_id === 1) {
      return this.isMydept();
    }

    if (appUser.role_id === 2) {
      return this.isAssignedToMe() && this.isMydept();
    }

    return false;
  }
}
