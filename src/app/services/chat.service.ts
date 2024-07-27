import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { MessageRequest } from '../dto/message-request';
import { Message } from '../dto/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
  }
  
  stompClient?: CompatClient;
  messages = new BehaviorSubject<Message[]>([])
  messages$ = this.messages.asObservable()
  
  initializeWebSocketConnection(id: number) {
    const serverUrl = 'http://localhost:8181/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function(frame:IMessage) {
      that.stompClient?.subscribe('/message' + id, (message:IMessage) => {
        if (message.body) {
          const messageObj = JSON.parse(message.body);
          let msg: Message[] = that.messages.value
          msg.push(messageObj);
          that.messages.next(msg);
        }
      });
    });
  }
  
  sendMessage(request: MessageRequest) {
    this.stompClient?.send('/app/hello' , {}, JSON.stringify(request));
  }
}
