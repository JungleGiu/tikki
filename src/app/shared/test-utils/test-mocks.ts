
import { Ticket, createTicketDTO, updateTicketDTO } from '../../core/models/ticket';
import { User, Location, Company } from '../../core/models/user';
import { AppError } from '../../core/services/errors/app-error';

export const mockLocationNewYork: Location = {
  name: 'New York Office',
  lat: '40.7128',
  lon: '-74.0060',
};

export const mockLocationSanFrancisco: Location = {
  name: 'San Francisco HQ',
  lat: '37.7749',
  lon: '-122.4194',
};

export const mockLocationLondon: Location = {
  name: 'London Branch',
  lat: '51.5074',
  lon: '-0.1278',
};

export const mockLocationTokyo: Location = {
  name: 'Tokyo Office',
  lat: '35.6762',
  lon: '139.6503',
};

export const mockLocationSydney: Location = {
  name: 'Sydney Office',
  lat: '-33.8688',
  lon: '151.2093',
};

export const mockLocation = mockLocationNewYork;

export function createMockLocation(overrides?: Partial<Location>): Location {
  return {
    ...mockLocation,
    ...overrides,
  };
}

export const mockAdminUser: Company = {
  id: 'admin-001',
  created_at: '2024-01-01T00:00:00Z',
  name: 'Sarah Anderson',
  role_id: 0,
  email: 'sarah.anderson@company.com',
};

export const mockManagerUser: User = {
  id: 'manager-001',
  created_at: '2024-01-15T00:00:00Z',
  name: 'James Mitchell',
  role_id: 1,
  email: 'james.mitchell@company.com',
  department_id: 1,
  created_by: 'admin-001',
  location: mockLocationNewYork,
};

export const mockEmployeeUser: User = {
  id: 'emp-001',
  created_at: '2024-02-01T00:00:00Z',
  name: 'Emma Wilson',
  role_id: 2,
  email: 'emma.wilson@company.com',
  department_id: 1,
  created_by: 'manager-001',
  location: mockLocationNewYork,
};

export const mockEmployeeUser2: User = {
  id: 'emp-002',
  created_at: '2024-02-10T00:00:00Z',
  name: 'Michael Chen',
  role_id: 2,
  email: 'michael.chen@company.com',
  department_id: 2,
  created_by: 'manager-001',
  location: mockLocationSanFrancisco,
};

export const mockEmployeeUser3: User = {
  id: 'emp-003',
  created_at: '2024-02-15T00:00:00Z',
  name: 'Sophie Laurent',
  role_id: 2,
  email: 'sophie.laurent@company.com',
  department_id: 1,
  created_by: 'manager-001',
  location: mockLocationLondon,
};

export function createMockUser(overrides?: Partial<User>): User {
  return {
    ...mockEmployeeUser,
    ...overrides,
  };
}

export const mockTicketQueued: Ticket = {
  id: 'ticket-001',
  created_at: '2024-12-01T09:00:00Z',
  priority: 2,
  resolved_at: null,
  department_id: 1,
  status: 0,
  created_by: 'emp-001',
  assigned_to: null,
  title: 'Fix critical login bug in SSO module',
  description:
    'Users unable to login with corporate SSO. Affects 40% of user base. Investigation shows token validation failure.',
  deadline: '2024-12-10T17:00:00Z',
  location: mockLocationNewYork,
  company_ref: 'admin-001',
};

export const mockTicketAssigned: Ticket = {
  id: 'ticket-002',
  created_at: '2024-12-02T10:30:00Z',
  priority: 1,
  resolved_at: null,
  department_id: 1,
  status: 1,
  created_by: 'emp-001',
  assigned_to: 'manager-001',
  title: 'Redesign dashboard UI/UX for new branding',
  description:
    'Update dashboard layout to match new brand guidelines. Requires responsive design for mobile devices.',
  deadline: '2024-12-20T17:00:00Z',
  location: mockLocationNewYork,
  company_ref: 'admin-001',
};

export const mockTicketInProgress: Ticket = {
  id: 'ticket-003',
  created_at: '2024-12-03T11:15:00Z',
  priority: 2,
  resolved_at: null,
  department_id: 1,
  status: 2,
  created_by: 'emp-003',
  assigned_to: 'emp-001',
  title: 'Implement dark mode feature',
  description:
    'Add dark mode toggle to settings and persist user preference in database. Should support system preference detection.',
  deadline: '2024-12-18T17:00:00Z',
  location: mockLocationLondon,
  company_ref: 'admin-001',
};

export const mockTicketCompleted: Ticket = {
  id: 'ticket-004',
  created_at: '2024-11-20T08:00:00Z',
  priority: 3,
  resolved_at: '2024-12-05T14:30:00Z',
  department_id: 1,
  status: 3,
  created_by: 'emp-001',
  assigned_to: 'manager-001',
  title: 'Database schema migration to v2.1',
  description: 'Migrate existing data to new schema with zero downtime. Create rollback plan.',
  deadline: '2024-12-05T17:00:00Z',
  location: mockLocationNewYork,
  company_ref: 'admin-001',
};

export const mockTicketDifferentDept: Ticket = {
  id: 'ticket-005',
  created_at: '2024-12-04T14:45:00Z',
  priority: 4,
  resolved_at: null,
  department_id: 2,
  status: 0,
  created_by: 'emp-002',
  assigned_to: null,
  title: 'Update Q4 sales pipeline forecasts',
  description:
    'Consolidate regional sales data and update pipeline forecasts for board meeting. Include revenue projections.',
  deadline: '2024-12-15T17:00:00Z',
  location: mockLocationSanFrancisco,
  company_ref: 'admin-001',
};

export const mockTicketCrossCompany: Ticket = {
  id: 'ticket-006',
  created_at: '2024-12-05T16:20:00Z',
  priority: 2,
  resolved_at: null,
  department_id: 1,
  status: 1,
  created_by: 'emp-003',
  assigned_to: 'emp-001',
  title: 'Integrate payment gateway API',
  description:
    'Integrate Stripe API for payment processing. Support multiple currencies and recurring billing.',
  deadline: '2024-12-25T17:00:00Z',
  location: mockLocationLondon,
  company_ref: 'admin-001',
};

export function createMockTicket(overrides?: Partial<Ticket>): Ticket {
  return {
    ...mockTicketQueued,
    id: `ticket-${Math.random().toString(36).substr(2, 9)}`,
    ...overrides,
  };
}

export const mockCreateTicketDTO: createTicketDTO = {
  priority: 4,
  department_id: 1,
  company_ref: 'admin-001',
  created_by: 'emp-001',
  status: 0,
  assigned_to: null,
  title: 'Add multi-language support to platform',
  description: 'Implement i18n framework and add support for Spanish, French, and German.',
  deadline: '2025-01-15T17:00:00Z',
  location: mockLocationNewYork,
};

export function createMockCreateTicketDTO(overrides?: Partial<createTicketDTO>): createTicketDTO {
  return {
    ...mockCreateTicketDTO,
    ...overrides,
  };
}

export const mockUpdateTicketDTO: updateTicketDTO = {
  title: 'Update API documentation for new endpoints',
  status: 1,
  assigned_to: 'manager-001',
  priority: 2,
  description: 'Complete API docs including request/response examples and error codes.',
};

export function createMockUpdateTicketDTO(overrides?: Partial<updateTicketDTO>): updateTicketDTO {
  return {
    ...mockUpdateTicketDTO,
    ...overrides,
  };
}

export const mockNotFoundError = new AppError('PGRST116');
export const mockPermissionError = new AppError('42501');
export const mockValidationError = new AppError('INVALID_INPUT');
export const mockDatabaseError = new AppError('23505');

export const mockUsersByRole = {
  admin: mockAdminUser,
  manager: mockManagerUser,
  employee: mockEmployeeUser,
};

export const mockUsersByDepartment = {
  engineering: [mockEmployeeUser, mockEmployeeUser3],
  sales: [mockEmployeeUser2],
};

export const mockTicketsByStatus = {
  queued: mockTicketQueued,
  assigned: mockTicketAssigned,
  inProgress: mockTicketInProgress,
  completed: mockTicketCompleted,
};

export const mockAllTickets = [
  mockTicketQueued,
  mockTicketAssigned,
  mockTicketInProgress,
  mockTicketCompleted,
  mockTicketDifferentDept,
  mockTicketCrossCompany,
];

export const mockAllLocations = [
  mockLocationNewYork,
  mockLocationSanFrancisco,
  mockLocationLondon,
  mockLocationTokyo,
  mockLocationSydney,
];
