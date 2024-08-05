import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/entities/user';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
  ) {}
  
  @Input() me?: User
  @Output() user = new EventEmitter<User>()
  allUsers?: User[]
  actualColumns?: User[]
  subscriptions: Subscription[] = []
  
  ngOnInit(): void {
    const sub = this.userService.getAllUsers().subscribe({
      next: data => {
        this.allUsers = data
        this.actualColumns = this.allUsers.slice(0, 20)
      }
    })
    this.subscriptions.push(sub)
  }

  selectUser(user: User) {
    this.user.emit(user)
  }

  start: number = 20
  onScroll(event: any) {
    const bottomPosition = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottomPosition && this.allUsers) {
      this.actualColumns = this.actualColumns?.concat(this.allUsers.slice(this.start, this.start + 20))
      this.start += 20
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
