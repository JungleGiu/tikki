import { Component, OnInit, signal, effect, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { config } from '../../config';
import { Location } from '../../../core/models/user';
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
  @Input({ required: false}) location : any
  @Output() newLocation= new EventEmitter<Location>();
  constructor() {
    effect(() => {
      const query = this.searchQuery();
      if (query &&query.length > 2) {
        this.locationSearch(this.searchQuery());
      }
    });
    effect(() => {
      if (this.selectedResult()) {
        const result = this.selectedResult();
        const location: Location = {
          name: result.name,
          lat: result.lat,
          lon: result.lon,
        }
        this.newLocation.emit(location);
        this.results.set([]);
        this.searchQuery.set(location.name)
      }
    });
  }
  ngOnInit(): void {
    this.geocoder = (L.Control as any).Geocoder.nominatim({
      geocodingQueryParams: {
        'accept-language': 'en',
      },
    });
    if (this.location?.name) {
      this.searchQuery.set(this.location.name);
    }
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
    this.results.set(data as Location[]);
  }
}
