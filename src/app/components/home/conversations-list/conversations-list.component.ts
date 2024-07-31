import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../dto/user';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { Message } from '../../../dto/message';
import { ConversationService } from '../../../services/conversation.service';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.css'
})
export class ConversationsListComponent implements OnChanges, OnInit, OnDestroy {

  constructor(
    private router: Router,
    private userService: UserService,
    private chatService: ChatService,
    private conversationService: ConversationService,
  ) {}

  @Output() profile = new EventEmitter<User>()
  @Output() conversation = new EventEmitter<User>()
  @Input() user?: User
  contacts: User[] = []
  lastMsg?: Message
  subscriptions: Subscription[] = []

  ngOnInit(): void {
    this.chatService.messages$.subscribe({
      next: msg => {
        if (msg && msg.sender.id !== this.user?.id && !this.contacts.find(item => item.id === msg.sender.id))
          this.contacts.push(msg.sender)
        if (msg && msg.receiver.id !== this.user?.id && !this.contacts.find(item => item.id === msg.receiver.id))
          this.contacts.push(msg.receiver)
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      const sub = this.userService.getContacts(this.user.id!).subscribe({
        next: data => {
          this.contacts = data
        }
      })
    }
  }

  openProfile() {
    this.profile.emit(this.user)
  }

  openConversation(conv: User) {
    this.conversation.emit(conv)
    this.profile.emit(undefined)
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/auth/login')
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
