import { Component,signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Map } from './map/map';
import { Calendar } from './calendar/calendar';
@Component({
  selector: 'app-tools',
  imports: [ButtonModule, Map, Calendar],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {
selectedTool= signal<string>('');
}
