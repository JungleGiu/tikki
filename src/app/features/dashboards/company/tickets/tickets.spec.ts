import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tickets } from './tickets';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Tickets', () => {
  let component: Tickets;
  let fixture: ComponentFixture<Tickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tickets],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
