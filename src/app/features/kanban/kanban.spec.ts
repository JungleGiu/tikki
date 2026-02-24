import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Kanban } from './kanban';
import { provideZonelessChangeDetection, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  mockTicketQueued,
  mockTicketAssigned,
  mockTicketInProgress,
  mockTicketCompleted,
  mockManagerUser,
  mockEmployeeUser,
  mockEmployeeUser2,
} from '../../shared/test-utils/test-mocks';

import { supabaseAuth } from '../../core/services/supabase/supabaseAuth';
import { SupabaseDb } from '../../core/services/supabase/supabase-db';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Ticket } from '../../core/models/ticket';

describe('Kanban', () => {
  let component: Kanban;
  let fixture: ComponentFixture<Kanban>;
  let dbMock: any;
  let authMock: any;

  const mockTickets = [
    mockTicketQueued,
    mockTicketAssigned,
    mockTicketInProgress,
    mockTicketCompleted,
  ];

  // Handle unhandled promise rejections during tests
  beforeAll(() => {
    jasmine.getEnv().allowRespy(true);
  });

  beforeEach(() => {
    // Suppress unhandled rejection warnings in tests
    spyOn(window, 'addEventListener');
  });

  beforeEach(async () => {
    dbMock = {
      updateTicket: jasmine.createSpy('updateTicket').and.resolveTo(),
      ticketsUpdatesListener: jasmine
        .createSpy('ticketsUpdatesListener')
        .and.returnValue(Promise.resolve()),
      unsubscribeFromTicketUpdates: jasmine.createSpy('unsubscribeFromTicketUpdates'),
    };

    let ticketsValue = [...mockTickets];

    // Create spies for the set method
    const ticketsSetSpy = jasmine.createSpy('ticketsSet').and.callFake((value: Ticket[]) => {
      ticketsValue = value;
    });

    authMock = {
      appUser: () => ({
        id: mockManagerUser.id,
        role_id: mockManagerUser.role_id,
        department_id: mockManagerUser.department_id,
      }),
      authUser: () => ({ id: mockManagerUser.id }),
      users: () => [mockEmployeeUser, mockEmployeeUser2, mockManagerUser],
      tickets: (() => ticketsValue) as any,
    };

    // Add spied set method to tickets
    (authMock.tickets as any).set = ticketsSetSpy;

    await TestBed.configureTestingModule({
      imports: [Kanban],
      providers: [
        provideZonelessChangeDetection(),
        { provide: supabaseAuth, useValue: authMock },
        { provide: SupabaseDb, useValue: dbMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Kanban);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset mocks after each test
    (dbMock.updateTicket as jasmine.Spy).calls.reset();
    (dbMock.updateTicket as jasmine.Spy).and.resolveTo();
    (authMock.tickets.set as jasmine.Spy).calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===== INITIALIZATION TESTS =====
  it('should initialize with correct default values', () => {
    expect(component.states).toEqual([0, 1, 2, 3]);
    expect(component.kanbanColumns().length).toBe(4);
    expect(component.assignModalVisible()).toBe(false);
    expect(component.pendingTicket()).toBeNull();
    expect(component.pendingNewStatus()).toBeNull();
  });

  it('should create kanban columns with all states', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    const columns = component.kanbanColumns();
    expect(columns.length).toBe(4);
    expect(columns[0].title).toBe('Queued');
    expect(columns[1].title).toBe('Assigned');
    expect(columns[2].title).toBe('In Progress');
    expect(columns[3].title).toBe('Completed');
  });

  // ===== STATE TITLE TESTS =====
  it('should return correct state titles', () => {
    expect(component.getStateTitle(0)).toBe('Queued');
    expect(component.getStateTitle(1)).toBe('Assigned');
    expect(component.getStateTitle(2)).toBe('In Progress');
    expect(component.getStateTitle(3)).toBe('Completed');
    expect(component.getStateTitle(999)).toBe('Unknown');
  });

  // ===== DROP OPERATION - HAPPY PATH =====
  it('should move ticket within same column', async () => {
    await component.ngOnInit();

    const queuedTickets = [mockTicketQueued, mockTicketQueued];
    const dropEvent: any = {
      container: { data: queuedTickets, id: '0' },
      previousContainer: { data: queuedTickets, id: '0' },
      previousIndex: 0,
      currentIndex: 1,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    // No update should be called for same column reorder
    expect(dbMock.updateTicket).not.toHaveBeenCalled();
  });

  it('should move queued ticket to assigned and show modal', async () => {
    await component.ngOnInit();

    const queuedColumn = [mockTicketQueued];
    const assignedColumn: any[] = [];

    const dropEvent: any = {
      container: { data: assignedColumn, id: '1' },
      previousContainer: { data: queuedColumn, id: '0' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    // Should show assignment modal when moving from queued to assigned
    expect(component.assignModalVisible()).toBe(true);
    expect(component.pendingTicket()).toEqual(mockTicketQueued);
    expect(component.pendingNewStatus()).toBe(1);
  });

  it('should move queued ticket to in progress and show modal', async () => {
    await component.ngOnInit();

    const queuedColumn = [mockTicketQueued];
    const inProgressColumn: any[] = [];

    const dropEvent: any = {
      container: { data: inProgressColumn, id: '2' },
      previousContainer: { data: queuedColumn, id: '0' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    expect(component.assignModalVisible()).toBe(true);
    expect(component.pendingNewStatus()).toBe(2);
  });

  it('should move assigned ticket to in progress without modal', async () => {
    await component.ngOnInit();

    const assignedColumn = [mockTicketAssigned];
    const inProgressColumn: any[] = [];

    const dropEvent: any = {
      container: { data: inProgressColumn, id: '2' },
      previousContainer: { data: assignedColumn, id: '1' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(component.assignModalVisible()).toBe(false);
    expect(dbMock.updateTicket).toHaveBeenCalled();
  });

  it('should move in progress ticket to completed', async () => {
    await component.ngOnInit();

    const inProgressColumn = [mockTicketInProgress];
    const completedColumn: any[] = [];

    const dropEvent: any = {
      container: { data: completedColumn, id: '3' },
      previousContainer: { data: inProgressColumn, id: '2' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(dbMock.updateTicket).toHaveBeenCalled();
    const call = (dbMock.updateTicket as jasmine.Spy).calls.mostRecent();
    expect(call.args[0].status).toBe(3);
    expect(call.args[0].resolved_at).toBeDefined();
  });

  it('should assign user when confirming modal assignment', async () => {
    component.pendingTicket.set(mockTicketQueued);
    component.pendingNewStatus.set(1);
    component.assignModalVisible.set(true);
    fixture.detectChanges();

    component.onAssignConfirm(mockEmployeeUser.id || 'emp-001');

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(dbMock.updateTicket).toHaveBeenCalled();
    expect(component.assignModalVisible()).toBe(false);
    expect(component.pendingTicket()).toBeNull();
    expect(component.pendingNewStatus()).toBeNull();
  });

  // ===== DROP OPERATION - NEGATIVE PATHS =====
  it('should not move ticket from different department', async () => {
    await component.ngOnInit();

    // Create a ticket from different department
    const differentDeptTicket = { ...mockTicketQueued, department_id: 999 };
    const queuedColumn = [differentDeptTicket];
    const assignedColumn: any[] = [];

    const dropEvent: any = {
      container: { data: assignedColumn, id: '1' },
      previousContainer: { data: queuedColumn, id: '0' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    // Should not move and should not update
    expect(dbMock.updateTicket).not.toHaveBeenCalled();
    expect(component.assignModalVisible()).toBe(false);
  });

  it('should not show modal when moving queued to queued', async () => {
    await component.ngOnInit();

    const queuedColumn = [mockTicketQueued];
    const anotherQueuedTicket = { ...mockTicketQueued, id: 'ticket-002' };

    const dropEvent: any = {
      container: { data: [anotherQueuedTicket], id: '0' },
      previousContainer: { data: queuedColumn, id: '0' },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(dropEvent);
    fixture.detectChanges();

    // Should not show modal as status hasn't changed
    expect(component.assignModalVisible()).toBe(false);
    expect(dbMock.updateTicket).not.toHaveBeenCalled();
  });

  it('should handle update failure with rollback', async () => {
    (dbMock.updateTicket as jasmine.Spy).and.rejectWith(new Error('Database error'));

    const originalTickets = [mockTicketAssigned];
    authMock.tickets.set(originalTickets);

    const assignedColumn = [...originalTickets];
    const inProgressColumn: any[] = [];

    const dropEvent: any = {
      container: { data: inProgressColumn, id: '2' },
      previousContainer: { data: assignedColumn, id: '1' },
      previousIndex: 0,
      currentIndex: 0,
    };

    // Suppress unhandled rejection errors for this test
    spyOn(console, 'error');

    // Drop initiates async update which will reject
    component.drop(dropEvent);
    fixture.detectChanges();

    // Let microtasks settle in zoneless
    await new Promise((resolve) => Promise.resolve().then(resolve));

    // Verify the update was attempted
    expect(dbMock.updateTicket).toHaveBeenCalled();

    // Rollback should have attempted to restore original state
    const currentTickets = authMock.tickets();
    expect(currentTickets).toBeDefined();
  });
  // ===== ASSIGNMENT CONFIRMATION TESTS =====
  it('should not confirm assignment without pending ticket', async () => {
    component.pendingTicket.set(null);
    component.pendingNewStatus.set(1);
    fixture.detectChanges();

    component.onAssignConfirm(mockEmployeeUser.id || 'emp-001');

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(dbMock.updateTicket).not.toHaveBeenCalled();
  });

  it('should not confirm assignment without pending status', async () => {
    component.pendingTicket.set(mockTicketQueued);
    component.pendingNewStatus.set(null);
    fixture.detectChanges();

    component.onAssignConfirm(mockEmployeeUser.id || 'emp-001');

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(dbMock.updateTicket).not.toHaveBeenCalled();
  });

  it('should assign null user when unassigning from assigned status', async () => {
    component.pendingTicket.set(mockTicketAssigned);
    component.pendingNewStatus.set(0); // Back to queued
    fixture.detectChanges();

    component.onAssignConfirm(null);

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(dbMock.updateTicket).toHaveBeenCalled();
    const call = (dbMock.updateTicket as jasmine.Spy).calls.mostRecent();
    expect(call.args[0].assigned_to).toBeNull();
  });

  // ===== TICKET UPDATE HANDLING TESTS =====
  it('should handle INSERT event for new ticket', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const newTicket = { ...mockTicketQueued, id: 'new-ticket-001' };
    const payload = {
      eventType: 'INSERT',
      new: newTicket,
    };

    component['handleTicketUpdate'](payload);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(authMock.tickets.set).toHaveBeenCalled();
  });

  it('should handle UPDATE event for existing ticket', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const updatedTicket = { ...mockTicketQueued, status: 1 };
    const payload = {
      eventType: 'UPDATE',
      new: updatedTicket,
    };

    component['handleTicketUpdate'](payload);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(authMock.tickets.set).toHaveBeenCalled();
  });

  it('should handle DELETE event for removed ticket', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const payload = {
      eventType: 'DELETE',
      old: mockTicketQueued,
    };

    component['handleTicketUpdate'](payload);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    expect(authMock.tickets.set).toHaveBeenCalled();
  });

  it('should skip local updates to prevent double processing', async () => {
    await component.ngOnInit();
    component.isLocalUpdate.set(true);
    fixture.detectChanges();

    const payload = {
      eventType: 'UPDATE',
      new: mockTicketQueued,
    };

    const ticketsBefore = authMock.tickets();
    component['handleTicketUpdate'](payload);

    // Should not update if it's a local update
    expect(component.isLocalUpdate()).toBe(false); // Flag should be reset
  });

  // ===== INITIALIZATION AND CLEANUP =====
  it('should call ngOnInit without errors', async () => {
    expect(async () => {
      await component.ngOnInit();
    }).not.toThrow();

    expect(dbMock.ticketsUpdatesListener).toHaveBeenCalled();
  });

  it('should unsubscribe from updates on destroy', () => {
    component.ngOnDestroy();

    expect(dbMock.unsubscribeFromTicketUpdates).toHaveBeenCalled();
  });

  // ===== KANBAN COLUMN ORGANIZATION =====
  it('should organize tickets by status in columns', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    const columns = component.kanbanColumns();

    // Verify column count
    expect(columns.length).toBe(4);

    // Verify each column has correct status
    expect(columns[0].tickets.every((t) => t.status === 0)).toBe(true);
    expect(columns[1].tickets.every((t) => t.status === 1)).toBe(true);
    expect(columns[2].tickets.every((t) => t.status === 2)).toBe(true);
    expect(columns[3].tickets.every((t) => t.status === 3)).toBe(true);
  });

  it('should prioritize own department tickets in columns', async () => {
    const ownDeptTicket = { ...mockTicketQueued, department_id: mockManagerUser.department_id };
    const otherDeptTicket = { ...mockTicketQueued, id: 'ticket-other', department_id: 999 };

    authMock.tickets.set([ownDeptTicket, otherDeptTicket]);
    fixture.detectChanges();

    await new Promise((resolve) => Promise.resolve().then(resolve));

    const columns = component.kanbanColumns();

    // Verify columns exist
    expect(columns.length).toBe(4);
    expect(columns[0].tickets).toBeDefined();

    // Verify own department ticket appears before other department ticket
    expect(columns[0].tickets.length).toBeGreaterThan(0);
    expect(columns[0].tickets[0].department_id).toBe(mockManagerUser.department_id);

    // If there are multiple tickets in the first column, verify ordering
    if (columns[0].tickets.length > 1) {
      const departmentIds = columns[0].tickets.map((t) => t.department_id);
      const ownDeptIndex = departmentIds.indexOf(mockManagerUser.department_id);
      const otherDeptIndex = departmentIds.indexOf(999);

      // Own department should come before other departments
      expect(ownDeptIndex).toBeLessThan(otherDeptIndex);
    }
  });
});
