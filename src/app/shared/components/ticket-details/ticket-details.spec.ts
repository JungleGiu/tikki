import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetails } from './ticket-details';
import { provideZonelessChangeDetection, NO_ERRORS_SCHEMA } from '@angular/core';
import { Ticket } from '../../../core/models/ticket';
import {
  mockTicketQueued,
  mockManagerUser,
  mockEmployeeUser,
  mockEmployeeUser2,
} from '../../test-utils/test-mocks';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { ToastAppService } from '../../../core/services/toast/toast-service';

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;
  const authMock: any = {
    appUser: () =>
      ({
        id: mockManagerUser.id,
        role_id: mockManagerUser.role_id,
        department_id: mockManagerUser.department_id,
      } as any),
    authUser: () => ({ id: mockManagerUser.id } as any),
    users: () => [mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any],
    tickets: () => [mockTicketQueued as any],
    loadUserData: () => Promise.resolve(),
    supabaseAuth: {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => {},
      },
    },
  };

  const dbMock: Partial<SupabaseDb> = {
    updateTicket: jasmine.createSpy('updateTicket').and.resolveTo(mockTicketQueued as Ticket),
    createTicket: jasmine.createSpy('createTicket').and.resolveTo(mockTicketQueued as Ticket),
    deleteTicket: jasmine.createSpy('deleteTicket').and.resolveTo(),
    getUsers: jasmine
      .createSpy('getUsers')
      .and.resolveTo([mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any]),
  } as any;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetails],
      providers: [
        provideZonelessChangeDetection(),
        { provide: supabaseAuth, useValue: authMock },
        { provide: SupabaseDb, useValue: dbMock },
        {
          provide: ToastAppService,
          useValue: {
            showSuccess: jasmine.createSpy('showSuccess'),
            showWarning: jasmine.createSpy('showWarning'),
            showError: jasmine.createSpy('showError'),
            showInfo: jasmine.createSpy('showInfo'),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetails);
    component = fixture.componentInstance;
    component.userRole = 1;
    component.userDepartment = 1;
    component.ticket = mockTicketQueued as Ticket;
    component.mode.set('create');
    component.isVisible.set(true);
    component.editMode.set(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly create a ticket when data is valid', () => {
 
  });
});
