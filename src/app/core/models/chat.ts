export interface Chat {
    id: string;
    created_at: string;
    ticket_ref: string;
    created_by: string;
    assigned_to: string;
    updated_at: string;
    archived_at: string | null;
}

export interface ChatMessage {
    id: string;
    chat_id: string;
    sender_id: string;
    message: string;
    created_at: string;
}
