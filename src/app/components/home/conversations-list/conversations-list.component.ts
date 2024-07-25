import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../dto/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrl: './conversations-list.component.css'
})
export class ConversationsListComponent implements OnChanges {

  constructor(
    private router: Router
  ) {}

  @Output() profile = new EventEmitter<boolean>(false)
  @Input() user?: User

  ngOnChanges(changes: SimpleChanges): void {}

  openProfile() {
    this.profile.emit(true)
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/auth/login')
  }
}
