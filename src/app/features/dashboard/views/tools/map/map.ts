import { Component, AfterViewInit,  Input } from '@angular/core';
import { config } from '../../../../../shared/config';
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
    L.Icon.Default.imagePath = config.leaflet.mapImage;
    this.map = L.map('map').setView([45.0, 10.0], 5);
    L.tileLayer(config.leaflet.mapTitle, {
      attribution: config.leaflet.mapAttribution,
    }).addTo(this.map);

    if(this.locations.length > 0) {
    this.locations.forEach((location) => {
      L.marker([location.lat, location.lng])
        .addTo(this.map!)
        .bindPopup(location.title || 'Ticket');
    });
    }
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
