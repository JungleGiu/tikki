import { Component, inject, signal } from '@angular/core';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Ticket } from '../../../core/models/ticket';
import { Calendar } from '../../tools/calendar/calendar';
import { Map } from './tools/map/map';
import { Charts } from '../../tools/charts/charts';


@Component({
  selector: 'app-dashboard',
  imports: [Calendar, Map, Charts],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.scss',
})
export class Dashboard {
  database = inject(SupabaseDb);
  tickets = signal<Ticket[]>([]);
  events = signal<any[]>([]);
  locations = signal<any[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.database
    .getTickets()
    .then((data) => {
      
        this.tickets.set(data);

       const locs = data.map((ticket) => {
      
          return {
            lat: ticket.location.lat,
            lng: ticket.location.lon,
            title: ticket.title,
            id: ticket.id,
          };
        });

        const events = data.map((ticket) => ({
          title: ticket.title,
          start: ticket.deadline,
          end: ticket.deadline,
          extendedProps: {
            ticketData: ticket,
          },
        }));

        this.events.set(events);
        this.locations.set(locs);
      })
      .catch((error) => {
        console.log(error);
      });

    this.database
      .getUsers()
      .then((data) => {
        this.database.users.set(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  rechargeData() {
    this.loadDashboardData();
  }
}
