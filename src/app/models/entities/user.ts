import { Role } from "../dto/role";
import { Message } from "./message";

export interface User {
    id?: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string
    verifiedEmail?: boolean,
    image: string,
    role: Role,
    blackList?: number[],
    sendes?: Message[],
    receives?: Message[],
    contact?: User[],
}
