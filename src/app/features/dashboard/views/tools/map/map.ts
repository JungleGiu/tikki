import { Component, AfterViewInit,  Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit {
  private map: L.Map | undefined;

  @Input() locations: any[] = [];
  private initMap(): void {
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
    this.map = L.map('map').setView([45.0, 10.0], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO',
    }).addTo(this.map);

    this.locations.forEach((location) => {
      L.marker([location.lat, location.lng])
        .addTo(this.map!)
        .bindPopup(location.title || 'Ticket');
    });
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
