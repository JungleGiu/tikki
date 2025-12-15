import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetails } from './ticket-details';
import { provideZonelessChangeDetection } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import {
  mockTicketQueued,
  mockManagerUser,
  mockEmployeeUser,
  mockEmployeeUser2,
} from '../../test-utils/test-mocks';
import { supabaseAuth as AuthToken } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { ToastAppService } from '../../../core/services/toast/toast-service';

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;

  const authMock: Partial<AuthToken> = {
    appUser: () =>
      ({
        id: mockManagerUser.id,
        role_id: mockManagerUser.role_id,
        department_id: mockManagerUser.department_id,
      } as any),
    authUser: () => ({ id: mockManagerUser.id } as any),
    users: () => [mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any],
  } as any;

  const dbMock: Partial<SupabaseDb> = {
    updateTicket: jasmine.createSpy('updateTicket').and.resolveTo(mockTicketQueued as Ticket),
    createTicket: jasmine.createSpy('createTicket').and.resolveTo(mockTicketQueued as Ticket),
    deleteTicket: jasmine.createSpy('deleteTicket').and.resolveTo(),
    getUsers: jasmine
      .createSpy('getUsers')
      .and.resolveTo([mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any]),
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetails],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthToken, useValue: authMock },
        { provide: SupabaseDb, useValue: dbMock },
        { provide: ToastAppService, useValue: ToastAppService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetails);
    component = fixture.componentInstance;
    component.ticket = mockTicketQueued as Ticket;
    component.mode.set('create');
    component.isVisible.set(true);
    component.editMode.set(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
