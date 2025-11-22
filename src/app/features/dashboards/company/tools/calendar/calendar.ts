import { Component, Input, effect } from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {

@Input() events: any[] = []

 calendarOptions!: CalendarOptions;

  constructor() {
    effect(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin ],
        events: this.events,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth, dayGridYear',
        },
        themeSystem: 'standard'
      };
    });
  }
}
