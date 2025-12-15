import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDashboard as Dashboard } from './company-dashboard';
import { provideZonelessChangeDetection, NO_ERRORS_SCHEMA } from '@angular/core';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../../core/services/supabase/supabase-db';
import { ToastAppService } from '../../../core/services/toast/toast-service';
import {
  mockManagerUser,
  mockEmployeeUser,
  mockEmployeeUser2,
  mockTicketQueued,
} from '../../../shared/test-utils/test-mocks';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const authMock: Partial<supabaseAuth> = {
    appUser: () =>
      ({
        id: mockManagerUser.id,
        role_id: mockManagerUser.role_id,
        department_id: mockManagerUser.department_id,
      } as any),
    authUser: () => ({ id: mockManagerUser.id } as any),
    users: () => [mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any],
    tickets: () => [mockTicketQueued as any],
    loadUserData: jasmine.createSpy('loadUserData').and.resolveTo(),
  } as any;

  const dbMock: Partial<SupabaseDb> = {
    getTickets: jasmine.createSpy('getTickets').and.resolveTo([mockTicketQueued as any]),
    getUsers: jasmine
      .createSpy('getUsers')
      .and.resolveTo([mockEmployeeUser as any, mockEmployeeUser2 as any, mockManagerUser as any]),
  } as any;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
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
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
