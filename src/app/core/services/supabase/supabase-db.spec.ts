import { TestBed } from '@angular/core/testing';

import { SupabaseDb } from './supabase-db';

describe('SupabaseDb', () => {
  let service: SupabaseDb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseDb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
