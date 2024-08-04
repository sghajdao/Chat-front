import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/entities/user';
import { Subscription } from 'rxjs';

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
  subscriptions: Subscription[] = []
  
  ngOnInit(): void {
    const sub = this.userService.getAllUsers().subscribe({
      next: data => this.allUsers = data
    })
    this.subscriptions.push(sub)
  }

  selectUser(user: User) {
    this.user.emit(user)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
