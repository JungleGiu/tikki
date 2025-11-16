
export interface User {
    id: number;
    name : string;
    location : string[];
    created_at : string;
    department_id : number;
    role_id : number;
    email : string;
}

export interface CreateUserData {
    name : string;
    location : string[];
    department_id : number;
    role_id : number;
    email : string;
}
