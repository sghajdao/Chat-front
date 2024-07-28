import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../dto/user';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.css'
})
export class ConversationsListComponent implements OnChanges, OnInit, OnDestroy {

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  @Output() profile = new EventEmitter<User>()
  @Output() conversation = new EventEmitter<User>()
  @Input() user?: User
  contacts: User[] = []
  subscriptions: Subscription[] = []

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      const sub = this.userService.getContacts(this.user.id!).subscribe({
        next: data => {
          this.contacts = data
        }
      })
      this.subscriptions.push(sub)
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
