import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { supabaseAuth } from './supabaseAuth';

describe('supabaseAuth', () => {
  let service: supabaseAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    provideZonelessChangeDetection();
    service = TestBed.inject(supabaseAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
