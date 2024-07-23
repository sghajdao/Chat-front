import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../dto/registerRequest';
import { LoginRequest } from '../dto/loginRequest';
import { AuthResponse } from '../dto/authResponse';
import { environment } from '../../environments/environment';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  isAuthenticated() {
    const token = localStorage.getItem("token")
    if (token) {
      if (jwtDecode(token).exp! - Math.floor((new Date).getTime() / 1000) > 0)
        return true
    }
    return false
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(environment.urlRequest + 'auth/register', request);
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(environment.urlRequest + 'auth/login', request);
  }
}
