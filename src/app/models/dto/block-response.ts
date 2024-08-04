import { User } from "../entities/user";

export interface BlokResponse {
    user: User,
    blocked: User,
}
