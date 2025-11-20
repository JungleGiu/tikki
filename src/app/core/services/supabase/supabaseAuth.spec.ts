import { TestBed } from '@angular/core/testing';

import { supabaseAuth } from './supabaseAuth';

describe('supabaseAuth', () => {
  let service: supabaseAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(supabaseAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
