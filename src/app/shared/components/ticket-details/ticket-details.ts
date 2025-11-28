import { Component, Input, signal } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import { DatePipe } from '@angular/common';
import { DepartmentPipePipe } from '../../pipes/department-pipe-pipe';
import {PriorityPipe} from '../../pipes/priority-pipe';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, DepartmentPipePipe , Badge, PriorityPipe],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
@Input({required: true}) ticket !: Ticket 
@Input() isVisible = signal<boolean>(false)
}
