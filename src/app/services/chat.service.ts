import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { MessageRequest } from '../models/dto/message-request';
import { Message } from '../models/entities/message';
import { BlockRequest } from '../models/dto/block-request';
import { BlokResponse } from '../models/dto/block-response';
import { WritingRequest } from '../models/dto/writing-request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
  }
  
  stompClient?: CompatClient;
  messages = new BehaviorSubject<Message | undefined>(undefined)
  messages$ = this.messages.asObservable()

  blocker = new BehaviorSubject<BlokResponse | undefined>(undefined)
  blocker$ = this.blocker.asObservable()

  writing = new BehaviorSubject<WritingRequest | undefined>(undefined)
  writing$ = this.writing.asObservable()
  
  initializeWebSocketConnection(id: number) {
    const serverUrl = 'http://localhost:8181/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function(frame:IMessage) {
      that.stompClient?.subscribe(`/message${id}`, (message:IMessage) => {
        if (message.body) {
          const messageObj = JSON.parse(message.body);
          that.messages.next(messageObj);
        }
      });

      that.stompClient?.subscribe(`/user${id}`, (message:IMessage) => {
        if (message.body) {
          const userObj = JSON.parse(message.body);
          that.blocker.next(userObj)
        }
      });

      that.stompClient?.subscribe(`/writing${id}`, (message:IMessage) => {
        if (message.body) {
          const userObj = JSON.parse(message.body);
          that.writing.next(userObj)
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

  isWriting(request: WritingRequest) {
    this.stompClient?.send('/app/write', {}, JSON.stringify(request))
  }
}
