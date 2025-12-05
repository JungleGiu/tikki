import { Component, Input } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { Badge } from '../badge/badge';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import { PriorityPipe } from '../../pipes/priority-pipe';
import { UserNamePipe } from '../../pipes/user-name-pipe';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-kanban-card',
  imports: [Badge, DepartmentPipePipe, PriorityPipe, UserNamePipe, DatePipe],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.scss',
})
export class KanbanCard {
@Input() ticket!: Ticket;
}
