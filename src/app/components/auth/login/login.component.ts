import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRequest } from '../../../models/dto/loginRequest';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  userData = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  validators: {email:boolean, password:boolean} = {
    email: false,
    password: false
  }

  loged: number = 0
  error:boolean = false

  subscriptions: Subscription[] = []

  onSignIn() {
    this.validators = {
      email: this.userData.get('email')!.invalid,
      password: this.userData.get('password')!.invalid
    }

    if (this.userData.value.email && this.userData.value.password) {      
      const user: LoginRequest = {email: this.userData.value.email, password: this.userData.value.password}
      this.loged = 1
      const sub = this.authService.login(user).subscribe({
        next: data=> {
          if (data.message === "Login Success") {
            localStorage.setItem("token", data.token);
            this.loged = 2
            this.router.navigateByUrl('')
          }
        },
        error: err=> {
          this.loged = 0
          this.error = true
        }
      })
      this.subscriptions.push(sub)
    }
  }

  onSignUp() {
    this.router.navigateByUrl('/auth/register')
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
