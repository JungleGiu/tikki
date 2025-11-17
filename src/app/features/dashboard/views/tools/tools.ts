import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Map } from './map/map';
import { Supabase } from '../../../../core/services/supabase';
import { Calendar } from './calendar/calendar';
import { Ticket } from '../../../../core/models/ticket';

@Component({
  selector: 'app-tools',
  imports: [ButtonModule, Map, Calendar],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {
  selectedTool = signal<string>('map');
  supabase = inject(Supabase);
  tickets = signal<Ticket[]>([]);

  locations = signal<any[]>([]);
  ngOnInit() {
    this.supabase
      .getTickets()
      .then((data) => {
        this.tickets.set(data);
        const locs = data.map((ticket) => ({
          lat: ticket.location[0],
          lng: ticket.location[1],
          title: ticket.title,
        }));

        this.locations.set(locs);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
