import { Message } from "../entities/message";
import { User } from "../entities/user";

export interface Contact {
    friend: User,
    lastMsg: Message
}
