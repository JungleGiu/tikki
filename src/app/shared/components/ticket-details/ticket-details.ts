import { Component, Input, signal , Signal} from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
@Component({
  selector: 'app-ticket-details',
  imports: [],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
@Input({required: true}) ticket !: Ticket 
@Input() isVisible = signal<boolean>(false)
}
