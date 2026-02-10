export interface RegisterUser {
    username:string|undefined; 
    password: string|undefined;
    email:string|undefined;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface LoginUser{
    email: string | undefined;
    password: string | undefined;
};