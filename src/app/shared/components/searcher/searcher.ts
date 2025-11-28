import { Component, Input, signal, Output, EventEmitter, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { User } from '../../../core/models/user';
@Component({
  selector: 'app-searcher',
  imports: [FormsModule, NgClass],
  templateUrl: './searcher.html',
  styleUrl: './searcher.scss',
})
export class Searcher {
  @Input() allUsers = signal<User[]>([]);
  isSearchingVisible = signal(false);
  isFiltersVisible = signal(false);
  query = signal('');
  filteredResults = signal<User[]>([]);
  sortQuery = signal('');
  @Output() onSearch = new EventEmitter<User[]>();

  constructor() {
    effect(() => {
      this.allUsers.set(this.allUsers());
    });
  }

  onQueryChange() {
    this.filterResults();
  }
  filterResults() {
    const query = this.query().toLowerCase().trim();
    if (query === '') {
      this.onSearch.emit(this.allUsers());
    } else {
      this.onSearch.emit(this.allUsers().filter((user) => user.name.toLowerCase().includes(query)));
    }
  }

  sortResults() {}

  toggleVisible(visibleType: 'search' | 'filters') {
    if (visibleType === 'search') {
      this.isSearchingVisible.set(!this.isSearchingVisible());
      if (!this.isSearchingVisible()) {
        this.query.set('');
      }
    } else if (visibleType === 'filters') {
      this.isFiltersVisible.set(!this.isFiltersVisible());
    }
  }
}
