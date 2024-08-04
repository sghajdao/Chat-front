import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '../../../models/entities/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { ConversationService } from '../../../services/conversation.service';
import { Contact } from '../../../models/dto/contact';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.css'
})
export class ConversationsListComponent implements OnChanges, OnInit, OnDestroy {

  constructor(
    private router: Router,
    private chatService: ChatService,
    private conversationService: ConversationService,
  ) {}

  @Output() profile = new EventEmitter<User>()
  @Output() conversation = new EventEmitter<User>()
  @Input() user?: User
  subscriptions: Subscription[] = []
  contacts: Contact[] = []

  ngOnInit(): void {
    const sub = this.chatService.messages$.subscribe({
      next: msg => {
        if (msg && msg.sender.id !== this.user?.id && !this.contacts.find(item => item.friend.id === msg.sender.id))
          this.contacts.push({friend:msg.sender, lastMsg: msg})
        else if (msg && msg.sender.id !== this.user?.id && this.contacts.find(item => item.friend.id === msg.sender.id)) {
          this.contacts = this.contacts.filter(item => item.friend.id !== msg.sender.id)
          this.contacts.unshift({friend: msg.sender, lastMsg: msg})
        }
        if (msg && msg.receiver.id !== this.user?.id && !this.contacts.find(item => item.friend.id === msg.receiver.id))
          this.contacts.push({friend:msg.receiver, lastMsg: msg})
        else if (msg && msg.receiver.id !== this.user?.id && this.contacts.find(item => item.friend.id === msg.receiver.id)) {
          this.contacts = this.contacts.filter(item => item.friend.id !== msg.receiver.id)
          this.contacts.unshift({friend: msg.receiver, lastMsg: msg})
        }
      }
    })
    this.subscriptions.push(sub)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      const sub2 = this.conversationService.getConversationsByUserId(this.user.id!).subscribe({
        next: data => {
          this.contacts = []
          data.forEach(item => this.contacts.push({friend: (item.messages[0].sender.id !== this.user?.id)? item.messages[0].sender : item.messages[0].receiver, lastMsg: item.messages[item.messages.length - 1]}))
          this.contacts.sort((a, b) => new Date(b.lastMsg.createdAt).getTime() - new Date(a.lastMsg.createdAt).getTime())
        }
      })
      this.subscriptions.push(sub2)
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
