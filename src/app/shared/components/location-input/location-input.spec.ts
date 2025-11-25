import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationInput } from './location-input';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LocationInput', () => {
  let component: LocationInput;
  let fixture: ComponentFixture<LocationInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
