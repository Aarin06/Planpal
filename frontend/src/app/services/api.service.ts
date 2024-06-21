import { Injectable } from '@angular/core';
import { Message } from '../classes/message';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */
  addMessage(content: string): Observable<Message> {
    return this.http.post<Message>(this.endpoint + '/api/messages', {
      content,
    });
  }

  deleteMessage(messageId: number): Observable<Message> {
    return this.http.delete<Message>(
      this.endpoint + `/api/messages/${messageId}`
    );
  }

  upvoteMessage(messageId: number) {
    return this.http.patch<Message>(
      this.endpoint + `/api/messages/${messageId}`, {
        action: "upvote"
      }
    )
  }

  downvoteMessage(messageId: number) {
    return this.http.patch<Message>(
      this.endpoint + `/api/messages/${messageId}`, {
        action: "downvote"
      }
    )
  }

  getMessages(): Observable<{ messages: Message[] }> {
    return this.http.get<{ messages: Message[] }>(
      this.endpoint + `/api/messages`
    );
  }

  signIn(username: string, password: string) {
    return this.http.post(
      this.endpoint + "/users/signin",{
        username: username,
        password:password
      })
  }

  signUp(username: string, password: string) {
    return this.http.post(
      this.endpoint + "/users/signup", {
        username: username,
        password: password
      }
    )
  }

  signOut() {
    return this.http.get(
      this.endpoint + "/users/signout"
    )
  }

  me() {
    return this.http.get(
      this.endpoint + "/users/me"
    )
  }
}
