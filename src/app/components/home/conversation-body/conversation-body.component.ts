import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { User } from '../../../dto/user';
import { ConversationService } from '../../../services/conversation.service';
import { ConversationRequest } from '../../../dto/conversation-request';
import { Conversation } from '../../../dto/conversation';
import { MessageRequest } from '../../../dto/message-request';

@Component({
  selector: 'app-conversation-body',
  templateUrl: './conversation-body.component.html',
  styleUrl: './conversation-body.component.css'
})
export class ConversationBodyComponent implements OnInit, OnChanges {

  constructor(
    private chatService: ChatService,
    private conversationService: ConversationService,
  ) {}

  // messages: Message[] = []
  // msg = new FormGroup({message: new FormControl})
  @Input() friend?: User
  @Input() user?: User
  conversation?: Conversation
  message: string = '';
  receivedMessages: string[] = [];

  ngOnInit() {
    this.chatService.messages$.subscribe({
      next: msg => this.receivedMessages = msg
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user && this.friend) {
      let request: ConversationRequest = {
        sender: this.user?.id!,
        receiver: this.friend?.id!
      }
      this.conversationService.getConversation(request).subscribe({
        next: data => {
          this.conversation = data
          this.conversation.messages.forEach(msg => this.receivedMessages.push(msg.content))
        }
      })
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
}
