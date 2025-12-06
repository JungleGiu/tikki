import { Component, effect, inject, signal } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Ticket } from '../../../core/models/ticket';

@Component({
  selector: 'app-head-dashboard',
  imports: [],
  templateUrl: './head-dashboard.html',
  styleUrl: './head-dashboard.scss',
})
export class HeadDashboard {
  session = inject(supabaseAuth);
  database = inject(SupabaseDb);
  events = signal<any[]>([]);
  locations = signal<any[]>([]);

  constructor() {
    // Whenever tickets change, recalculate events and locations
    effect(() => {
      const tickets = this.session.tickets();
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

  async rechargeData() {
    try {
      const freshTickets = await this.database.getTickets();
      this.session.tickets.set(freshTickets);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }
}
