import { Component, OnInit, signal, effect, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { config } from '../../config';
import L from 'leaflet';
import 'leaflet-control-geocoder';
@Component({
  selector: 'app-location-input',
  imports: [FormsModule],
  templateUrl: './location-input.html',
  styleUrl: './location-input.scss',
})
export class LocationInput implements OnInit {
  geocoder: any;
  searchQuery = signal('');
  results = signal<any[]>([]);
  selectedResult = signal<any>({});
  @Input() location: string | null = null;
  @Output() coords: EventEmitter<any> = new EventEmitter();
  constructor() {
    effect(() => {
      if (this.searchQuery().length > 2) {
        this.locationSearch(this.searchQuery());
      }
    });
    effect(() => {
      if (this.selectedResult()) {
        this.coords.emit(this.selectedResult());
        this.results.set([]);
      }
    });
  }
  ngOnInit(): void {
    this.geocoder = (L.Control as any).Geocoder.nominatim({
      geocodingQueryParams: {
        'accept-language': 'en',
      },
    });
  }

  async locationSearch(search: string) {
    const searchLimit = '5';
    const searchUrl =
      config.leaflet.nominatim +
      search +
      config.leaflet.nominatimFormat +
      config.leaflet.nominatimLimit +
      searchLimit;
    const response = await fetch(searchUrl);
    const data = await response.json();
    this.results.set(data);
  }
}
