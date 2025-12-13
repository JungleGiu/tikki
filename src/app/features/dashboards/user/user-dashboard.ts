import { Component, computed, effect, inject, signal } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Ticket } from '../../../core/models/ticket';
import { Calendar } from '../../tools/calendar/calendar';
import { Map } from '../../tools/map/map';
import { Charts } from '../../tools/charts/charts';
import { TicketsStatus } from '../../../shared/components/tickets-status/tickets-status';
import { AppError } from '../../../core/services/errors/app-error';

@Component({
  selector: 'app-user',
  imports: [Calendar, Map, Charts, TicketsStatus],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
 session = inject(supabaseAuth);
  database = inject(SupabaseDb);
  events = signal<any[]>([]);
  locations = signal<any[]>([]);
  tickets = signal<Ticket[]>([]);

 myTickets = computed(() =>
    this.tickets().filter(
      (ticket) => ticket.assigned_to === this.session.authUser()?.id
    )
  );

  constructor() {
    effect(() => {
      const tickets = this.session.tickets();  
      this.tickets.set(tickets);

      const myTickets = this.myTickets();
      this.updateDashboardData(myTickets);
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
    // Refresh from database
    this.database
      .getTickets()
      .then((freshTickets) => {
        this.session.tickets.set(freshTickets.filter(
          (ticket) => ticket.assigned_to === this.session.authUser()?.id
        ));
      })
      .catch((error) => {
        throw new AppError(error instanceof AppError ? error.code : 'UNKNOWN');
      });
  }
}

