import { Component, Input, Output, signal, EventEmitter, computed, effect } from '@angular/core';

@Component({
  selector: 'app-pagination-tool',
  imports: [],
  templateUrl: './pagination-tool.html',
  styleUrl: './pagination-tool.scss',
})
export class PaginationTool {
  @Input() elements = signal<any[]>([]);
  @Output() currentResults = new EventEmitter<any[]>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  totalResults = computed(() => this.elements().length);
  resultsPerPage = 10;
  numberOfPages = computed(() => Math.ceil(this.totalResults() / this.resultsPerPage));
  pages = computed(() => {
    const num = this.numberOfPages();
    return num > 0 ? Array.from({ length: num }, (_, index) => index + 1) : [];
  });
  currentPage = signal(1);

  constructor() {
    effect(() => {
      this.elements(); 
      this.currentPage.set(1);
    });

    effect(() => {
      this.currentPage();
      this.emitCurrentPage();
    });
  }

  onNextPage() {
    if (this.currentPage() < this.numberOfPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.emitCurrentPage();
    }
  }

  onPreviousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.emitCurrentPage();
    }
  }

  onPageClick(page: number) {
    this.currentPage.set(page);
    this.emitCurrentPage();
  }

  private emitCurrentPage() {
    const startIndex = (this.currentPage() - 1) * this.resultsPerPage;
    const endIndex = startIndex + this.resultsPerPage;
    this.currentResults.emit(this.elements().slice(startIndex, endIndex));
  }
}
