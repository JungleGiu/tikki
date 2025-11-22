
export interface Company {
    id?: string;
    created_at?: string;
    name : string;   
    role_id : number;
    email : string;
}
export interface User extends Company {
    location? : Location | null;
    department_id : number;
    created_by? : string;
}

export interface Location {
    name: string;
    lat: string;
    lon: string;
  }

