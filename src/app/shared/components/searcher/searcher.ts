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
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  @Output() onSearch = new EventEmitter<User[]>();

  constructor() {
    effect(() => {
      this.allUsers.set(this.allUsers());
      if (this.filteredResults().length === 0) {
      this.filteredResults.set(this.allUsers());
    }
    });
  }

  onQueryChange() {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort() {
   
    const query = this.query().toLowerCase().trim();
    let results = query === '' 
      ? [...this.allUsers()] 
      : this.allUsers().filter((user) => user.name.toLowerCase().includes(query));

    if (this.sortQuery() && this.sortQuery() !== '0') {
      results = this.applySorting(results);
    }

    this.filteredResults.set(results);
    this.onSearch.emit(results);
  }

  applySorting(users: User[]): User[] {
    const query = this.sortQuery();
    const direction = this.sortDirection();
    
    return [...users].sort((a, b) => {
      let comparison = 0;
      if (query === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (query === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (query === 'role') {
        comparison = a.role_id - b.role_id;
      } else if (query === 'department') {
        comparison = a.department_id - b.department_id;
      }
      return direction === 'desc' ? -comparison : comparison;
    });
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortQuery.set(selectElement.value);
    this.applyFiltersAndSort();
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