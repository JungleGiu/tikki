import { Component, OnInit, signal, effect, EventEmitter, Output, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { config } from '../../config';
import { Location } from '../../../core/models/user';
import { AppError } from '../../../core/services/errors/app-error';
import L from 'leaflet';
import 'leaflet-control-geocoder';
@Component({
  selector: 'app-location-input',
  imports: [FormsModule],
  templateUrl: './location-input.html',
  styleUrl: './location-input.scss',
})
export class LocationInput implements OnInit, OnDestroy, OnChanges {
  geocoder: any;
  searchQuery = signal('');
  results = signal<any[]>([]);
  selectedResult = signal<any>({});
  @Input({ required: false}) location  : any = null
  @Output() newLocation= new EventEmitter<Location>();

  private searchTimeout?: number;
  private readonly DEBOUNCE_DELAY = 500;
  constructor() {
    effect(() => {
    const loc = this.location;
    if (loc?.name && this.searchQuery() !== loc.name) {
      this.searchQuery.set(loc.name);
      this.selectedResult.set(loc);
    }
  });
    effect(() => {
      const query = this.searchQuery();
      if(this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      if (query && query.length > 2 && query !== this.location?.name) {
        this.searchTimeout = window.setTimeout(() => {
          this.locationSearch(query);
        }, this.DEBOUNCE_DELAY);
      } else {
        this.results.set([]);
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
      this.selectedResult.set(this.location);
    }
  }
  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  ngOnChanges(): void {
  if (this.location?.name && this.searchQuery() !== this.location.name) {
    this.searchQuery.set(this.location.name);
    this.selectedResult.set(this.location);
  }
}
  async locationSearch(search: string) {
  try {  const searchLimit = '10';
   const params = new URLSearchParams( {
     q: search,
     format: 'json',
     limit: searchLimit,
        addressdetails: '1',
        'accept-language': 'en',
        featuretype:'city',
   });
   const searchUrl= `${config.leaflet.nominatim}?${params.toString()}`
    const response = await fetch(searchUrl);
    const data = await response.json();
     const filteredResults = data.filter((result: any) => {
        const type = result.type?.toLowerCase();
        const addressType = result.address?.city || 
                           result.address?.town || 
                           result.address?.village ||
                           result.address?.municipality;
        
        return type === 'city' || 
               type === 'town' || 
               type === 'village' || 
               type === 'administrative' ||
               addressType;
      });
    this.results.set(filteredResults.slice(0, 5));
  } catch (error : any)  {
    this.results.set([]);
    console.error(error);
    throw new AppError(error.code || 'UNKNOWN_ERROR');
  }
}
  }

