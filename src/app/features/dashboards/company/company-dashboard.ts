import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { Ticket } from '../../../core/models/ticket';
import { Calendar } from '../../tools/calendar/calendar';
import { Map } from '../../tools/map/map';
import { Charts } from '../../tools/charts/charts';

@Component({
  selector: 'app-company-dashboard',
  imports: [Calendar, Map, Charts],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.scss',
})
export class CompanyDashboard implements OnInit {
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

  ngOnInit() {
    // Load company tickets on component initialization
    this.loadCompanyTickets();
  }

  async loadCompanyTickets() {
    try {
      const currentUser = this.session.appUser();
      if (!currentUser) return;

      const allTickets = await this.database.getTickets();
      // For company users (role_id: 0), company_ref is set to their created_by field
      const companyTickets = allTickets.filter(
        (ticket) => ticket.company_ref === currentUser.created_by
      );
      this.session.tickets.set(companyTickets);
    } catch (error) {
      console.error('Failed to load company tickets:', error);
    }
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
    this.loadCompanyTickets();
  }
}
