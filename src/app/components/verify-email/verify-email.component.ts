import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MailService } from '../../services/mail.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../models/entities/user';
import { Subscription } from 'rxjs';
import { VerifyEmailRequest } from '../../models/dto/verify-email-request';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private mailService: MailService,
    private router: Router,
  ) {}

  user?: User
  sent: boolean = false
  form = new FormGroup({number: new FormControl})
  number?: number
  loading: boolean = false
  error: boolean = false

  subscriptions: Subscription[] = []

  ngOnInit(): void {
    const email = this.userService.getEmail();
    if (email) {
      const sub = this.userService.getUserByEmail().subscribe({
        next: data => {
          this.user = data
        }
      })
      this.subscriptions.push(sub)
    }
    else
      this.router.navigateByUrl('/auth/login')
  }

  sendVerifyNumber() {
    if (this.user) {
      this.loading = true
      this.number = Math.floor(Math.random()*90000) + 10000;
      const request: VerifyEmailRequest = {
        email: this.user.email,
        number: this.number
      }
      const sub = this.mailService.sendVerifyNumber(request).subscribe({
        next: data =>{
          this.sent = true
          this.loading = false
        }
      })
      this.subscriptions.push(sub)
    }
  }

  verifyEmail() {
    const email = this.userService.getEmail()
    if (this.user && this.form.valid && +this.form.value.number === this.number) {
      this.loading = true
      this.error = false
      const sub = this.mailService.verifyEmail(this.user.email).subscribe({
        next: data => {
          this.loading = false
          this.router.navigateByUrl('/')
        },
        error: () => this.router.navigateByUrl('/auth/login')
      })
      this.subscriptions.push(sub)
    }
    else if (!email) {
      this.router.navigateByUrl('/auth/login')
    }
    else if (this.form.valid && +this.form.value.number != this.number) {
      this.error = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
