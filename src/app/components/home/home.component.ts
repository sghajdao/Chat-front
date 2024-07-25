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
  ) {}

  subscriptions: Subscription[] = []
  profile: boolean = false
  user?: User

  ngOnInit() {
    const sub = this.userService.getUserByEmail().subscribe({
      next: data => this.user = data
    })
    this.subscriptions.push(sub)
  }

  openProfile(event: boolean) {
    this.profile = event
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
