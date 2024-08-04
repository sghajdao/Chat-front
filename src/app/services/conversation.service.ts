import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConversationRequest } from '../models/dto/conversation-request';
import { Conversation } from '../models/entities/conversation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient,
  ) { }

  getConversation(request: ConversationRequest) {
    return this.http.post<Conversation>(environment.urlRequest + 'conversation/get', request, this.getHeaders())
  }

  getConversationsByUserId(id: number) {
    return this.http.get<Conversation[]>(environment.urlRequest + 'conversation/list/' + id, this.getHeaders());
  }

  private getHeaders(){
    const accessToken = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${accessToken}` };
    return {headers};
  }
}
