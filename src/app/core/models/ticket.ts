import { Location } from "./user";
export interface Ticket {
    id: string;
    created_at: string;
    priority: number;
    resolved_at: string | null;
    department_id: number;
    status: string;
    created_by: string;
    assigned_to: string | null;
    title: string;
    description: string;
    deadline: string;
    location: Location;
}

export interface createTicketDTO {
    priority: number;
    department_id: number;
    created_by: string;
    status: string;
    assigned_to:  null;
    title: string;
    description: string;
    deadline: string;
    location: Location;
}

export interface updateTicketDTO {
    priority?: number;
    department_id?: number;
    status?: string;
    assigned_to?: string | null;
    title?: string;
    description?: string;
    deadline?: string;
    location?: Location;
}
