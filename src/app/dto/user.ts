import { Role } from "./role";

export interface User {
    id?: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string
    verifiedEmail?: boolean,
    image: string,
    role: Role,
}
