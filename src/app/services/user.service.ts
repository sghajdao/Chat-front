import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../dto/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BlockRequest } from '../dto/block-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getEmail() {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      if (decoded)
        return decoded.sub
      else
        return null
    }
    return null;
  }

  getUserByEmail() {
    const email = this.getEmail()
    if (email)
      return this.http.get<User>(environment.urlRequest + 'user/' + email, this.getHeaders());
    return new Observable<User>()
  }

  editUser(user: User) {
    return this.http.put<User>(environment.urlRequest + 'user/edit', user, this.getHeaders());
  }

  getContacts(id: number) {
    return this.http.get<User[]>(environment.urlRequest + 'user/all/' + id, this.getHeaders());
  }

  getAllUsers() {
    return this.http.get<User[]>(environment.urlRequest + 'user/all', this.getHeaders());
  }

  blockUser(request: BlockRequest) {
    return this.http.put<User>(environment.urlRequest + 'user/block', request, this.getHeaders());
  }

  unblockUser(request: BlockRequest) {
    return this.http.put<User>(environment.urlRequest + 'user/unblock', request, this.getHeaders());
  }

  private getHeaders(){
    const accessToken = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${accessToken}` };
    return {headers};
  }
}
