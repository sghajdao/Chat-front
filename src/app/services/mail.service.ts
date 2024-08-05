import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VerifyEmailRequest } from '../models/dto/verify-email-request';
import { environment } from '../../environments/environment';
import { User } from '../models/entities/user';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(
    private http: HttpClient,
  ) { }

  sendVerifyNumber(request: VerifyEmailRequest) {
    return this.http.post<boolean>(environment.urlRequest + 'mail/verify', request, this.getHeaders())
  }

  verifyEmail(email: string) {
    return this.http.put<User>(environment.urlRequest + 'user/verify', email, this.getHeaders())
  }

  private getHeaders(){
    const accessToken = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${accessToken}` };
    return {headers};
  }
}
