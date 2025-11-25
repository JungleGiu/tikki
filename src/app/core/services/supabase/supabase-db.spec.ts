import { TestBed } from '@angular/core/testing';

import { SupabaseDb } from './supabase-db';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SupabaseDb', () => {
  let service: SupabaseDb;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(SupabaseDb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
