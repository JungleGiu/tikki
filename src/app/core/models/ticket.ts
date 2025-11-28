export interface Ticket {
    id: string;
    created_at: string;
    priority: number;
    resolved_at: string;
    department_id: number;
    status: string;
    created_by: string;
    assigned_to: number;
    attached: JSON[]
    title: string;
    description: string;
    deadline: string;
    location: JSON[];
}
