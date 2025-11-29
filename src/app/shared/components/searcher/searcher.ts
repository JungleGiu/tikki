import { Component, Input, signal, Output, EventEmitter, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { User } from '../../../core/models/user';
import { Ticket } from '../../../core/models/ticket';
import { TitleCasePipe } from '@angular/common';
type SearchableData = User | Ticket;

@Component({
  selector: 'app-searcher',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './searcher.html',
  styleUrl: './searcher.scss',
})
export class Searcher<T extends SearchableData = SearchableData> {
  @Input() allData = signal<T[]>([]);
  @Input() searchFields: string[] = ['name']; // Customize search fields per data type
  isSearchingVisible = signal(false);
  isFiltersVisible = signal(false);
  query = signal('');
  filteredResults = signal<T[]>([]);
  sortQuery = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  @Output() onSearch = new EventEmitter<T[]>();

  constructor() {
    effect(() => {
      this.allData.set(this.allData());
      if (this.filteredResults().length === 0) {
        this.filteredResults.set(this.allData());
      }
    });
  }

  onQueryChange() {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort() {
    const query = this.query().toLowerCase().trim();
    let results =
      query === ''
        ? [...this.allData()]
        : this.allData().filter((item) =>
            this.searchFields.some((field) => {
              const value = (item as any)[field];
              return typeof value === 'string' && value.toLowerCase().includes(query);
            })
          );

    if (this.sortQuery() && this.sortQuery() !== '') {
      results = this.applySorting(results as T[]);
    }

    this.filteredResults.set(results as T[]);
    this.onSearch.emit(results as T[]);
  }

  applySorting(items: T[]): T[] {
    const query = this.sortQuery();
    const direction = this.sortDirection();

    return [...items].sort((a, b) => {
      let comparison = 0;
      const aValue = a[query as keyof T];
      const bValue = b[query as keyof T];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'number') {
        comparison = aValue.localeCompare(String(bValue));
      } else if (typeof aValue === 'number' && typeof bValue === 'string') {
        comparison = String(aValue).localeCompare(bValue);
      }

      return direction === 'desc' ? -comparison : comparison;
    });
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = parseInt(selectElement.value);
    if (selectedIndex > 0 && selectedIndex <= this.searchFields.length) {
      this.sortQuery.set(this.searchFields[selectedIndex - 1]);
      this.applyFiltersAndSort();
    }
  }

  toggleSortOrder() {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');

    const reversed = [...this.filteredResults()].reverse();
    this.filteredResults.set(reversed);
    this.onSearch.emit(reversed);
  }

  toggleVisible(visibleType: 'search' | 'filters') {
    if (visibleType === 'search') {
      this.isSearchingVisible.set(!this.isSearchingVisible());
      if (!this.isSearchingVisible()) {
        this.query.set('');
        this.applyFiltersAndSort();
      }
    } else if (visibleType === 'filters') {
      this.isFiltersVisible.set(!this.isFiltersVisible());
    }
  }
}
