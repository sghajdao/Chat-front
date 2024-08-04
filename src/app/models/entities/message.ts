import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message {
    id?: number,
    type: string,
    content: string,
    sender: User,
    receiver: User,
    conversation: Conversation,
    createdAt: Date,
}
