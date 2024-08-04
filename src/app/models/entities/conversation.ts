import { Message } from "./message";

export interface Conversation {
    id?: number,
    messages: Message[]
}
