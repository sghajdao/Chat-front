import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { User } from '../../../dto/user';
import { ConversationService } from '../../../services/conversation.service';
import { ConversationRequest } from '../../../dto/conversation-request';
import { Conversation } from '../../../dto/conversation';
import { MessageRequest } from '../../../dto/message-request';
import { Subscription } from 'rxjs';
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
  @Output() profile = new EventEmitter<User>()
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

    const sub2 = this.chatService.blocker$.subscribe({
      next: data => {
        if (this.friend?.id === data?.id)
          this.friend = data
      }
    })
    this.subscriptions.push(sub2)
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
          this.receivedMessages = []
          this.conversation.messages.forEach(msg => this.receivedMessages.push(msg))
          this.chatService.messages.next(this.receivedMessages)
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

  openProfile(event: User) {
    this.profile.emit(event)
  }

  getDate(value: Date): string {
    if (value) {
        const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
        if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
            return 'Just now';
        const intervals: any = {
            'year': 31536000,
            'month': 2592000,
            'week': 604800,
            'day': 86400,
            'hour': 3600,
            'minute': 60,
            'second': 1
        };
        let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0)
                if (counter === 1) {
                    return counter + ' ' + i + ' ago'; // singular (1 day ago)
                } else {
                    return counter + ' ' + i + 's ago'; // plural (2 days ago)
                }
        }
    }
    return value.toDateString();
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.chatService.messages.next([])
  }
}
