import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-conversation-body',
  templateUrl: './conversation-body.component.html',
  styleUrl: './conversation-body.component.css'
})
export class ConversationBodyComponent implements OnInit {

  constructor(
    private chatService: ChatService
  ) {}

  // messages: Message[] = []
  // msg = new FormGroup({message: new FormControl})
  message: string = '';
  receivedMessages: string[] = [];

  ngOnInit() {
    this.chatService.messages$.subscribe({
      next: msg => this.receivedMessages = msg
    })
  }

  onSendMessage() {
    if (this.message[0])
      this.chatService.sendMessage(this.message);
  }
}
