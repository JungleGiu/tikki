import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsStatus } from './tickets-status';

describe('TicketsStatus', () => {
  let component: TicketsStatus;
  let fixture: ComponentFixture<TicketsStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
