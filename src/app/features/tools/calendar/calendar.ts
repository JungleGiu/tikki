import { Component, input, signal, effect, EventEmitter, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import multimonthPlugin from '@fullcalendar/multimonth';
import { Ticket } from '../../../core/models/ticket';
import { TicketDetails } from '../../../shared/components/ticket-details/ticket-details';
@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule, TicketDetails],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  events = input<any[]>([]);
  calendarOptions = signal<CalendarOptions>({});
  isVisible = signal<boolean>(false);
  ticket = signal<Ticket>({} as Ticket);
  @Output() recharge = new EventEmitter<void>();

  constructor() {
    effect(() => {
      const eventsData = this.events();
      this.updateCalendarOptions(eventsData);
    });
  }

  private updateCalendarOptions(eventsData: any[]): void {
    const options: CalendarOptions = {
      initialView: 'currentMonth',
      plugins: [multimonthPlugin, dayGridPlugin],
      events: eventsData,
      dayMaxEvents: true,
      views: {
        multiMonthFourMonth: {
          type: 'multiMonth',
          duration: { months: 6 },
        },
        currentMonth: {
          type: 'dayGridMonth',
        },
      },
      buttonText: {
        currentMonth: 'Current Month',
        multiMonthFourMonth: '6 months',
      },
      headerToolbar: {
        left: 'prev,next',
        center: 'title',

        right: 'currentMonth,multiMonthFourMonth',
      },
      themeSystem: 'standard',
      contentHeight: 400,
      aspectRatio: 1,
      selectable: true,
      selectMirror: true,
      eventClick: (info) => {
        const ticket = info.event.extendedProps['ticketData'] as Ticket;
        this.openTicket(ticket);
      },
    };
    this.calendarOptions.set(options);
  }

  openTicket(ticket: Ticket) {
    this.isVisible.set(true);
    console.log('Opening ticket from calendar:', ticket.id);
    this.ticket.set(ticket);
  }
  onrechargeData() {
    this.recharge.emit();
  }
}
