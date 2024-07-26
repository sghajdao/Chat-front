import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { RegisterRequest } from '../../../dto/registerRequest';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  userData = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  validators: {firstname:boolean, lastname:boolean, email:boolean, password:boolean} = {
    firstname: false,
    lastname: false,
    email: false,
    password: false
  }

  loged: number = 0

  subscriptions: Subscription[] = []

  onSignUp() {
    this.validators = {
      firstname: this.userData.get('firstname')!.invalid,
      lastname: this.userData.get('lastname')!.invalid,
      email: this.userData.get('email')!.invalid,
      password: this.userData.get('password')!.invalid
    }
    if (this.userData.value.firstname && this.userData.value.lastname && this.userData.value.email && this.userData.value.password) {
      let request: RegisterRequest = {firstname: this.userData.value.firstname, lastname: this.userData.value.lastname,
                                        email: this.userData.value.email, password: this.userData.value.password}
      this.loged = 1
      const sub = this.authService.register(request).subscribe({
        next: response => {
          if (response.message === 'Already exist')
            this.router.navigateByUrl('auth/login')
          else {
            this.loged = 2
            localStorage.setItem('token', response.token)
            // this.router.navigateByUrl('/verify-email')
          }
        }
      })
      this.subscriptions.push(sub)
    }
  }

  onSignIn() {
    this.router.navigateByUrl('/auth/login')
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
