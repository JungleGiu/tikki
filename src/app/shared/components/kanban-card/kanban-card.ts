import { Component, inject, Input, signal } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { Badge } from '../badge/badge';
import { DepartmentPipe } from '../../pipes/department-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { DatePipe, NgClass } from '@angular/common';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TicketDetails } from '../ticket-details/ticket-details';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/supabase/chat-service';
import { getDashboardPathForRole } from '../../../core/guards/role-guard';
@Component({
  selector: 'app-kanban-card',
  imports: [
    Badge,
    DepartmentPipe,
    PriorityPipe,
    UserNamePipe,
    DatePipe,
    NgClass,
    CdkDrag,
    TicketDetails,
  ],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.scss',
})
export class KanbanCard {
  @Input() ticket!: Ticket;
  auth = inject(supabaseAuth);
  chatService = inject(ChatService);
  router = inject(Router);
  openedDetails = signal<boolean>(false);
  ticketDetailsVisible = signal<boolean>(false);
  viewTicketDetails = signal<'view' | 'edit' | 'create'>('view');
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

  openTicketDetails() {
    this.ticketDetailsVisible.set(true);
  }

  async openTicketChat(ticketId: string) {
    const chat = await this.chatService.getChatByTicketId(ticketId);
    if (chat) {
    const appUser = this.auth.appUser();
    if (appUser) {
      const dashboardPath = getDashboardPathForRole(appUser.role_id);
      this.router.navigate([`${dashboardPath}/chat`], { state: { chatId: chat.id } });
    }
  }
  }
}
