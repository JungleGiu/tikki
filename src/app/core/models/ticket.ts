import { Location } from './user';
export interface Ticket {
  id: string;
  created_at: string;
  priority: number;
  resolved_at: string | null;
  department_id: number;
  status: number;
  created_by: string;
  assigned_to: string | null;
  title: string;
  description: string;
  deadline: string;
  location: Location;
  company_ref: string;
}

export interface createTicketDTO {
  priority: number;
  department_id: number;
  company_ref: string;
  created_by: string;
  status: number;
  assigned_to: string | null;
  title: string;
  description: string;
  deadline: string;
  location: Location;
}

export interface updateTicketDTO {
  priority?: number;
  status?: number;
  assigned_to?: string | null;
  title?: string;
  description?: string;
  deadline?: string;
  location?: Location;
  company_ref?: string;
  resolved_at?: string | null;
}
