import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetails } from './ticket-details';
import { provideZonelessChangeDetection } from '@angular/core';
describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetails],
      providers: [provideZonelessChangeDetection()],

    }).compileComponents();
    
    fixture = TestBed.createComponent(TicketDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
