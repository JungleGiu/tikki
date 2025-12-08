import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { User } from '../../../core/models/user';
import { RolePipePipe } from '../../pipes/role-pipe-pipe';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import { Badge } from '../badge/badge';
import { Ticket } from '../../../core/models/ticket';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { StatusPipe } from '../../pipes/status-pipe';
import { DatePipe } from '@angular/common';
import { UserNamePipe } from '../../pipes/user-name-pipe';
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [RolePipePipe, StatusPipe, Badge, DepartmentPipePipe, PriorityPipe, DatePipe, UserNamePipe],
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
