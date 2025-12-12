import { TestBed } from '@angular/core/testing';
import { supabaseAuth } from './supabaseAuth';

import { provideZonelessChangeDetection } from '@angular/core';


describe('supabaseAuth', () => {
  let service: supabaseAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(supabaseAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
