import { Component, inject, signal, effect } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Ticket } from '../../../core/models/ticket';
import { Calendar } from '../../tools/calendar/calendar';
import { Map } from '../../tools/map/map';
import { Charts } from '../../tools/charts/charts';

@Component({
  selector: 'app-dashboard',
  imports: [Calendar, Map, Charts],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.scss',
})
export class Dashboard {
  session = inject(supabaseAuth);
  database = inject(SupabaseDb);
  events = signal<any[]>([]);
  locations = signal<any[]>([]);
  tickets = signal<Ticket[]>([]);

  constructor() {
    // Whenever tickets or users change, recalculate events and locations
    effect(() => {
      const tickets = this.session.tickets();
      this.tickets.set(tickets);
      if (tickets.length > 0) {
        this.updateDashboardData(tickets);
      }
    });
  }

  private updateDashboardData(tickets: Ticket[]) {
    const locs = tickets.map((ticket) => ({
      lat: ticket.location.lat,
      lng: ticket.location.lon,
      title: ticket.title,
      id: ticket.id,
    }));

    const events = tickets.map((ticket) => ({
      title: ticket.title,
      start: ticket.deadline,
      end: ticket.deadline,
      extendedProps: {
        ticketData: ticket,
      },
    }));

    this.events.set(events);
    this.locations.set(locs);
  }

  rechargeData() {
    // Refresh from database
    this.database
      .getTickets()
      .then((freshTickets) => {
        this.session.tickets.set(freshTickets);
      })
      .catch((error) => {
        console.error('Failed to refresh data:', error);
      });
  }
}
