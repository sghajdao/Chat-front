import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

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
    this.chatService.sendMessage(this.message);
  }

}
