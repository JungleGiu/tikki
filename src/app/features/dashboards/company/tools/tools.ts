import { Component, signal, inject } from '@angular/core';
import { Map } from './map/map';
import { Calendar } from './calendar/calendar';
import { Ticket } from '../../../../core/models/ticket';
import { Charts } from './charts/charts';
import { SupabaseDb } from '../../../../core/services/supabase/supabase-db';
@Component({
  selector: 'app-tools',
  imports: [Map, Calendar, Charts],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {
  selectedTool = signal<string>('map');
  database = inject(SupabaseDb);
  tickets = signal<Ticket[]>([]);
  events = signal<any[]>([]);
  locations = signal<any[]>([]);
  ngOnInit() {
    this.database
      .getTickets()
      .then((data) => {
        this.tickets.set(data);
        const locs = data.map((ticket) => ({
          lat: ticket.location[0],
          lng: ticket.location[1],
          title: ticket.title,
        }));
        const events = data.map((ticket) => ({
          title: ticket.title,
          start: ticket.deadline,
          end: ticket.deadline,
        }));
        this.events.set(events);
        this.locations.set(locs);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
