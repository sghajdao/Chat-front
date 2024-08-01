export interface MessageRequest {
    type: string,
    body: string,
    sender: number,
    reciever: number,
    conversation: number,
}
