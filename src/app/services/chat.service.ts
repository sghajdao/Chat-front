import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
    this.initializeWebSocketConnection();
  }
  
  stompClient?: CompatClient;
  messages = new BehaviorSubject<string[]>([])
  messages$ = this.messages.asObservable()
  
  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8181/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame:IMessage) {
      that.stompClient?.subscribe('/message', (message:IMessage) => {
        if (message.body) {
          const msg: string[] = that.messages.value
          msg.push(message.body)
          that.messages.next(msg);
        }
      });
    });
  }
  
  sendMessage(message:string) {
    this.stompClient?.send('/app/hello' , {}, message);
  }
}
