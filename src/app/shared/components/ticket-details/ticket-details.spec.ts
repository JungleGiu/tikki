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
import { timestamptzToDateInput } from '../../utils/date-utils';

describe('TicketDetails', () => {
  let component: TicketDetails;
  let fixture: ComponentFixture<TicketDetails>;
  let toastServiceMock: any;

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

  beforeEach(async () => {
    toastServiceMock = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showWarning: jasmine.createSpy('showWarning'),
      showError: jasmine.createSpy('showError'),
      showInfo: jasmine.createSpy('showInfo'),
    };

    await TestBed.configureTestingModule({
      imports: [TicketDetails],
      providers: [
        provideZonelessChangeDetection(),
        { provide: supabaseAuth, useValue: authMock },
        { provide: SupabaseDb, useValue: dbMock },
        { provide: ToastAppService, useValue: toastServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

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

  afterEach(() => {
    // Reset spies AND restore default behavior for clean state
    (dbMock.updateTicket as jasmine.Spy).calls.reset();
    (dbMock.updateTicket as jasmine.Spy).and.resolveTo(mockTicketQueued as Ticket);

    (dbMock.createTicket as jasmine.Spy).calls.reset();
    (dbMock.createTicket as jasmine.Spy).and.resolveTo(mockTicketQueued as Ticket);

    (dbMock.deleteTicket as jasmine.Spy).calls.reset();
    (dbMock.deleteTicket as jasmine.Spy).and.resolveTo();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===== INITIALIZATION TESTS =====
  it('should initialize with correct default values', () => {
    expect(component.mode()).toBe('create');
    expect(component.isVisible()).toBe(true);
    expect(component.editMode()).toBe(false);
    expect(component.deleteDialog()).toBe(false);
  });

  it('should populate editForm with ticket data when mode is edit', async () => {
    component.mode.set('edit');
    fixture.detectChanges();

    // In zoneless, effects run synchronously but may need microtask to settle
    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(component.editForm.value.title).toBe(mockTicketQueued.title);
    expect(component.editForm.value.description).toBe(mockTicketQueued.description);
    expect(component.editForm.value.priority).toBe(mockTicketQueued.priority?.toString());
    expect(component.editForm.value.status).toBe(mockTicketQueued.status?.toString());
    expect(component.editForm.value.deadline).toBe(
      timestamptzToDateInput(mockTicketQueued.deadline)
    );
  });

  it('should not populate editForm when mode is view or create', () => {
    component.mode.set('view');
    fixture.detectChanges();
    expect(component.editForm.value.title).toBe('');
    component.mode.set('create');
    fixture.detectChanges();
    expect(component.editForm.value.title).toBe('');
  });

  // ===== CREATE FORM TESTS =====
  it('should have createForm with required validators', () => {
    const form = component.createForm;
    expect(form.get('department_id')?.hasError('required')).toBe(true);
    expect(form.get('title')?.hasError('required')).toBe(true);
    expect(form.get('description')?.hasError('required')).toBe(true);
    expect(form.get('deadline')?.hasError('required')).toBe(true);
  });

  it('should mark createForm as invalid when required fields are empty', () => {
    component.createForm.patchValue({
      department_id: '',
      title: '',
      description: '',
      deadline: '',
    });
    expect(component.createForm.valid).toBe(false);
  });

  it('should mark createForm as valid when all required fields are filled', () => {
    component.createForm.patchValue({
      department_id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      deadline: '2025-12-25',
    });
    expect(component.createForm.valid).toBe(true);
  });

  // ===== CREATE TICKET TESTS =====
  it('should correctly create a ticket when data is valid', async () => {
    // Ensure createTicket is set to resolve
    (dbMock.createTicket as jasmine.Spy).and.resolveTo(mockTicketQueued as Ticket);
    
    component.createForm.patchValue({
      department_id: '1',
      title: 'New Ticket',
      description: 'New Description',
      priority: '2',
      deadline: '2025-12-25',
      status: '0',
    });
    fixture.detectChanges();

    await component.onCreateSubmit();

    expect(dbMock.createTicket).toHaveBeenCalled();
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Ticket created successfully');
  });

  it('should show warning when creating ticket without department', async () => {
    component.createForm.patchValue({
      department_id: '',
      title: 'New Ticket',
      description: 'New Description',
      deadline: '2025-12-25',
    });
    fixture.detectChanges();

    await component.onCreateSubmit();

    expect(toastServiceMock.showWarning).toHaveBeenCalledWith('Please select a department');
    expect(dbMock.createTicket).not.toHaveBeenCalled();
  });

  it('should show error toast on create failure', async () => {
    (dbMock.createTicket as jasmine.Spy).and.rejectWith('Database error');

    component.createForm.patchValue({
      department_id: '1',
      title: 'New Ticket',
      description: 'New Description',
      deadline: '2025-12-25',
    });
    fixture.detectChanges();

    await component.onCreateSubmit();

    expect(toastServiceMock.showError).toHaveBeenCalledWith('Error creating ticket');
  });

  // ===== EDIT TICKET TESTS =====
  it('should correctly update a ticket when data is valid', async () => {
    // Ensure updateTicket is set to resolve
    (dbMock.updateTicket as jasmine.Spy).and.resolveTo(mockTicketQueued as Ticket);
    
    component.mode.set('edit');
    fixture.detectChanges();

    // Wait for effect to settle
    await new Promise((resolve) => Promise.resolve().then(resolve));

    component.editForm.patchValue({
      title: 'Updated Title',
      description: 'Updated Description',
      priority: '1',
      deadline: '2025-12-25',
      status: '1',
      assigned_to: mockEmployeeUser.id?.toString(),
    });
    fixture.detectChanges();

    await component.onEditSubmit();

    expect(dbMock.updateTicket).toHaveBeenCalled();
    expect(toastServiceMock.showSuccess).toHaveBeenCalled();
  });

  it('should prevent status change without assigning user', async () => {
    component.mode.set('edit');
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    component.editForm.patchValue({
      title: 'Updated Title',
      description: 'Updated Description',
      status: '1', // Assigned status
      assigned_to: null, // No assignment
    });
    fixture.detectChanges();

    await component.onEditSubmit();

    expect(toastServiceMock.showWarning).toHaveBeenCalledWith(
      'Please assign the ticket to a user before changing its status.'
    );
    expect(dbMock.updateTicket).not.toHaveBeenCalled();
  });

  it('should auto-assign status to 1 (Assigned) when assigning user from status 0 (Queued)', async () => {
    component.mode.set('edit');
    component.ticket.status = 0; // Start with Queued
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    component.editForm.patchValue({
      assigned_to: mockEmployeeUser.id?.toString(),
      status: '0', // Keep as Queued
    });
    fixture.detectChanges();

    await component.onEditSubmit();

    expect(dbMock.updateTicket).toHaveBeenCalled();
    const call = (dbMock.updateTicket as jasmine.Spy).calls.mostRecent();
    expect(call.args[0].status).toBe(1); // Should be changed to Assigned
  });

  it('should reset form after successful ticket update', async () => {
    // Set initial state - these are set in beforeEach
    expect(component.mode()).toBe('create');
    expect(component.isVisible()).toBe(true);

    // Now set to edit mode
    component.mode.set('edit');
    fixture.detectChanges();

    // Wait for effect to populate the form
    await new Promise((resolve) => Promise.resolve().then(resolve));

    component.editForm.patchValue({
      title: 'Updated Title',
      description: 'Updated Description',
    });
    fixture.detectChanges();

    await component.onEditSubmit();

    // Verify reset() was called by checking the signal states changed
    expect(component.mode()).toBe('view');
    expect(component.isVisible()).toBe(false);
    expect(component.editMode()).toBe(false);
    expect(component.deleteDialog()).toBe(false);
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Ticket updated successfully');
  });

  it('should show error toast on update failure', async () => {
    (dbMock.updateTicket as jasmine.Spy).and.rejectWith('Database error');

    component.mode.set('edit');
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    component.editForm.patchValue({
      title: 'Updated Title',
      description: 'Updated Description',
    });
    fixture.detectChanges();

    await component.onEditSubmit();

    expect(toastServiceMock.showError).toHaveBeenCalledWith('Error updating ticket');
  });

  // ===== DELETE TICKET TESTS =====
  it('should delete ticket successfully', async () => {
    (dbMock.deleteTicket as jasmine.Spy).and.resolveTo();

    try {
      await component.onDelete(mockTicketQueued.id);
    } catch (error) {}

    expect(dbMock.deleteTicket).toHaveBeenCalledWith(mockTicketQueued.id);
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Ticket deleted successfully');
  });
  it('should rethrow error from delete failure', async () => {
    // Note: Component's onDelete rethrows errors instead of showing toast
    (dbMock.deleteTicket as jasmine.Spy).and.rejectWith('Database error');

    let errorThrown = false;
    try {
      await component.onDelete(mockTicketQueued.id);
    } catch (error) {
      errorThrown = true;
      expect(error).toBe('Database error');
    }

    // Verify the error was actually thrown as per component behavior
    expect(errorThrown).toBe(true);
    expect(dbMock.deleteTicket).toHaveBeenCalledWith(mockTicketQueued.id);
  });
  it('should reset dialog state after delete', async () => {
    // Ensure deleteTicket is set to resolve (in case previous test left it rejecting)
    (dbMock.deleteTicket as jasmine.Spy).and.resolveTo();

    component.deleteDialog.set(true);
    fixture.detectChanges();

    await component.onDelete(mockTicketQueued.id);

    expect(component.deleteDialog()).toBe(false);
    expect(component.isVisible()).toBe(false);
  });

  // ===== LOCATION TESTS =====
  it('should update newLocation when onLocationSelected is called', () => {
    const mockLocation = { lat: '10.5', lon: '20.5', name: 'Test Location' };
    component.onLocationSelected(mockLocation);
    expect(component.newLocation).toEqual(mockLocation);
  });

  it('should use new location in created ticket', async () => {
    const mockLocation = { lat: '10.5', lon: '20.5', name: 'Test Location' };
    component.newLocation = mockLocation;

    component.createForm.patchValue({
      department_id: '1',
      title: 'New Ticket',
      description: 'New Description',
      deadline: '2025-12-25',
    });
    fixture.detectChanges();

    await component.onCreateSubmit();

    const call = (dbMock.createTicket as jasmine.Spy).calls.mostRecent();
    expect(call.args[0].location).toEqual(mockLocation);
  });

  // ===== SIGNAL UPDATES TESTS =====
  it('should emit recharge event when reset is called', async () => {
    spyOn(component.recharge, 'emit');
    component.createForm.patchValue({
      department_id: '1',
      title: 'New Ticket',
      description: 'New Description',
      deadline: '2025-12-25',
    });
    fixture.detectChanges();

    await component.onCreateSubmit();

    expect(component.recharge.emit).toHaveBeenCalled();
  });

  it('should update deleteDialog signal', () => {
    expect(component.deleteDialog()).toBe(false);
    component.deleteDialog.set(true);
    expect(component.deleteDialog()).toBe(true);
  });
});
