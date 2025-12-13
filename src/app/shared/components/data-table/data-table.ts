import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { User } from '../../../core/models/user';
import { RolePipe } from '../../pipes/role-pipe';
import { DepartmentPipe } from '../../pipes/department-pipe';
import { Badge } from '../badge/badge';
import { Ticket } from '../../../core/models/ticket';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { StatusPipe } from '../../pipes/status-pipe';
import { DatePipe } from '@angular/common';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [RolePipe, StatusPipe, Badge, DepartmentPipe, PriorityPipe, DatePipe, UserNamePipe],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() usersElements = signal<User[]>([]);
  @Input() ticketsElements = signal<Ticket[]>([]);

  @Output() selectEditUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<string>();
  @Output() selectTicket = new EventEmitter<Ticket>();
  @Output() deleteTicket = new EventEmitter<string>();
  auth = inject(supabaseAuth);
  userRole = this.auth.appUser()?.role_id;
  
  isAdmin(): boolean {
    return this.userRole === 0;
  }

  onSelectEdit(selected: User) {
    this.selectEditUser.emit(selected);
  }

  onDeleteUser(id: string) {
    this.deleteUser.emit(id);
  }
  onSelectTicket(selected: Ticket) {
    this.selectTicket.emit(selected);
  }
  onDeleteTicket(id: string) {
    this.deleteTicket.emit(id);
  }
}
