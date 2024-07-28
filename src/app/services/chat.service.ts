import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { MessageRequest } from '../dto/message-request';
import { Message } from '../dto/message';
import { User } from '../dto/user';
import { BlockRequest } from '../dto/block-request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
  }
  
  stompClient?: CompatClient;
  messages = new BehaviorSubject<Message[]>([])
  messages$ = this.messages.asObservable()

  blocker = new BehaviorSubject<User | undefined>(undefined)
  blocker$ = this.blocker.asObservable()
  
  initializeWebSocketConnection(id: number) {
    const serverUrl = 'http://localhost:8181/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function(frame:IMessage) {
      that.stompClient?.subscribe(`/message${id}`, (message:IMessage) => {
        if (message.body) {
          const messageObj = JSON.parse(message.body);
          let msg: Message[] = that.messages.value
          msg.push(messageObj);
          that.messages.next(msg);
        }
      });

      that.stompClient?.subscribe(`/user${id}`, (message:IMessage) => {
        console.log(message.body)
        if (message.body) {
          const userObj = JSON.parse(message.body);
          that.blocker.next(userObj)
        }
      });
    });
  }
  
  sendMessage(request: MessageRequest) {
    this.stompClient?.send('/app/hello' , {}, JSON.stringify(request));
  }

  updateUser(request: BlockRequest) {
    this.stompClient?.send('/app/block', {}, JSON.stringify(request))
  }
}
