import { Component, Input, effect, signal } from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import multimonthPlugin from '@fullcalendar/multimonth';
import { Ticket } from '../../../../../core/models/ticket';
import { TicketDetails } from '../../../../../shared/components/ticket-details/ticket-details';
@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule, TicketDetails],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {

@Input() events: Ticket[] = []

 calendarOptions!: CalendarOptions;
isVisible = signal<boolean>(false);
ticket = signal<Ticket>({} as Ticket);
  constructor() {
    effect(() => {
      this.calendarOptions = {
        initialView: 'multiMonthFourMonth',
        plugins: [ multimonthPlugin, dayGridPlugin ],
        events: this.events,
         dayMaxEvents: true,
        views: {
          multiMonthFourMonth:{
            type: 'multiMonth',
            duration: { months: 6 }
          },
          currentMonth: {
            type: 'dayGridMonth'
          }
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
         contentHeight: 600,
         aspectRatio: 2.3,
         selectable: true,
         selectMirror: true,
         
      
      eventClick:(info) => {
        const ticket = info.event.extendedProps['ticketData'] as Ticket;
        console.log(ticket);
        this.openTicket(ticket);
      }
    };
    });
  }

  openTicket(ticket :any) {
    this.isVisible.set(true);
    this.ticket.set(ticket);
  }
}