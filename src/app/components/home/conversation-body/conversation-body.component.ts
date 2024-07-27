import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { User } from '../../../dto/user';
import { ConversationService } from '../../../services/conversation.service';
import { ConversationRequest } from '../../../dto/conversation-request';
import { Conversation } from '../../../dto/conversation';
import { MessageRequest } from '../../../dto/message-request';
import { Subscription } from 'rxjs';
import { IMessage } from '@stomp/stompjs';
import { Message } from '../../../dto/message';

@Component({
  selector: 'app-conversation-body',
  templateUrl: './conversation-body.component.html',
  styleUrl: './conversation-body.component.css'
})
export class ConversationBodyComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

  constructor(
    private chatService: ChatService,
    private conversationService: ConversationService,
  ) {}

  @Input() friend?: User
  @Input() user?: User
  conversation?: Conversation
  message: string = '';
  receivedMessages: Message[] = [];
  subscriptions: Subscription[] = []
  @ViewChild('scrollContainer') myScrollContainer?: ElementRef;

  ngOnInit() {
    const sub = this.chatService.messages$.subscribe({
      next: msg => {
        this.receivedMessages = msg
      }
    })
    this.subscriptions.push(sub)
  }

  ngAfterViewChecked() {        
    if (this.myScrollContainer) {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer?.nativeElement.scrollHeight
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user && this.friend) {
      let request: ConversationRequest = {
        sender: this.user?.id!,
        receiver: this.friend?.id!
      }
      const sub = this.conversationService.getConversation(request).subscribe({
        next: data => {
          this.conversation = data
          this.conversation.messages.forEach(msg => this.receivedMessages.push(msg))
        }
      })
      this.subscriptions.push(sub)
    }
  }

  onSendMessage() {
    if (this.message[0] && this.user && this.friend) {
      let request: MessageRequest = {
        body: this.message,
        sender: this.user.id!,
        reciever: this.friend.id!,
        conversation: this.conversation? this.conversation.id! : -1
      }
      this.chatService.sendMessage(request);
      this.message = ''
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.chatService.messages.next([])
  }
}
