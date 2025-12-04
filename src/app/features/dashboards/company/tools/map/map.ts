import {
  Component,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class Map implements AfterViewInit, OnChanges {
  private map: L.Map | undefined;
  @Input() tickets: Ticket[] = [];
  @Input() locations: any[] = [];
  @Output() markerClicked = new EventEmitter<Ticket>();
  @Output() recharge = new EventEmitter<void>();
  isVisible = signal<boolean>(false);
  ticket = signal<Ticket>({} as Ticket);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locations'] && !changes['locations'].firstChange) {
      this.rebuildMap();
    }
  }

  private rebuildMap(): void {
 
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });
    }

    this.initMap();
  }

  private initMap(): void {
    if (!this.map) {
      L.Icon.Default.imagePath = config.leaflet.mapImage;
      this.map = L.map('map').setView([45.0, 10.0], 5);
      L.tileLayer(config.leaflet.mapTitle, {
        attribution: config.leaflet.mapAttribution,
      }).addTo(this.map);
    }

    if (this.tickets.length > 0) {
      this.tickets.forEach((ticket) => {
        const marker = L.marker([parseFloat(ticket.location.lat), parseFloat(ticket.location.lon)])
          .addTo(this.map!)
          .bindPopup(ticket.title || 'Ticket');

        marker.on('click', () => {
          const ticketData = this.tickets.find((t) => t.id === ticket.id);
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

  onrechargeData() {
    this.recharge.emit();
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
