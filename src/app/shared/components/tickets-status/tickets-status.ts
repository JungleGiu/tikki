import { Component, Input, Signal } from '@angular/core';

import { Ticket } from '../../../core/models/ticket';
@Component({
  selector: 'app-tickets-status',
  imports: [],
  templateUrl: './tickets-status.html',
  styleUrl: './tickets-status.scss',
})
export class TicketsStatus {
  @Input() tickets! : Signal<Ticket[]>;

  get queuedTicketsCount(): number {
    return this.tickets().filter((ticket) => ticket.status === 0).length;
  }

  get assignedTicketsCount(): number {
    return this.tickets().filter((ticket) => ticket.status === 1).length;
  }

  get inProgressTicketsCount(): number {
    return this.tickets().filter((ticket) => ticket.status === 2).length;
  }
  get completedTicketsCount(): number {
    return this.tickets().filter((ticket) => ticket.status === 3).length;
  }
}
