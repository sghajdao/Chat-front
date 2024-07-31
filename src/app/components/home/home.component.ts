import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../dto/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  subscriptions: Subscription[] = []
  profile?: User
  user?: User
  conversation?: User

  ngOnInit() {
    const sub = this.userService.getUserByEmail().subscribe({
      next: data => {
        this.user = data
        this.chatService.initializeWebSocketConnection(data.id!)
      }
    })
    this.subscriptions.push(sub)

    const sub2 = this.chatService.blocker$.subscribe({
      next: data => {
        if (this.user?.id === data?.user.id && this.conversation?.id === data?.blocked.id) {
          this.user = data?.user
          this.conversation = data?.blocked
        }
        else if (this.user?.id === data?.blocked.id && this.conversation?.id === data?.user.id) {
          this.user = data?.blocked
          this.conversation = data?.user
        }
      }
    })
    this.subscriptions.push(sub2)
  }

  openProfile(event: User) {
    this.profile = event
  }

  openConversation(event: User) {
    this.conversation = event
    this.profile = undefined
  }

  updateUser(event: User) {
    this.user = event
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
