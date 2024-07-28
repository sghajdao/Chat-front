import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message {
    id?: number,
    content: string,
    sender: User,
    receiver: User,
    conversation: Conversation,
    createdAt: Date,
}
