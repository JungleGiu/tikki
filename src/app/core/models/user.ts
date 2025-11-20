
export interface Company {
    id?: string;
    created_at?: string;
    name : string;   
    role_id : number;
    email : string;
}
export interface User extends Company {
    location? : string[];
    department_id : number;
}



