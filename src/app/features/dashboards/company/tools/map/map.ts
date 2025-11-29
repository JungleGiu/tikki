import { Component, AfterViewInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { config } from '../../../../../shared/config';
import * as L from 'leaflet';
import { TicketDetails } from '../../../../../shared/components/ticket-details/ticket-details';
import { Ticket } from '../../../../../core/models/ticket';
@Component({
  selector: 'app-map',
  imports: [TicketDetails],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit {
  private map: L.Map | undefined;
  @Input() tickets: Ticket[] = [];
  @Input() locations: any[] = [];
  @Output() markerClicked = new EventEmitter<Ticket>();

  isVisible = signal<boolean>(false);
  ticket = signal<Ticket>({} as Ticket);

  private initMap(): void {
    L.Icon.Default.imagePath = config.leaflet.mapImage;
    this.map = L.map('map').setView([45.0, 10.0], 5);
    L.tileLayer(config.leaflet.mapTitle, {
      attribution: config.leaflet.mapAttribution,
    }).addTo(this.map);

    if (this.locations.length > 0) {
      this.locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng])
          .addTo(this.map!)
          .bindPopup(location.title || 'Ticket');

        marker.on('click', () => {
          const ticketData = this.tickets.find((t) => t.id === location.id);
          if (ticketData) {
            this.openTicket(ticketData);
          }
        });
      });
    }
  }

  private openTicket(ticketData: Ticket): void {
    this.isVisible.set(true);
    this.ticket.set(ticketData);
    this.markerClicked.emit(ticketData);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.locations.length > 0) {
        this.initMap();
      } else {
        setTimeout(() => this.initMap(), 500);
      }
    }, 100);
  }


}
