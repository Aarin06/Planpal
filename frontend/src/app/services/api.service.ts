import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { user } from '../classes/user';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */

  me(): Observable<user> {
    return this.http.get<user>(this.endpoint + '/users/me');
  }

  signOut() {
    return this.http.get(this.endpoint + '/users/signout');
  }

  getUsers(): Observable<{ users: user[] }> {
    return this.http.get<{ users: user[] }>(
      this.endpoint + `/users`
    );
  }
  
  // addMessage(content: string): Observable<Message> {
  //   return this.http.post<Message>(this.endpoint + '/api/messages', {
  //     content,
  //   });
  // }

  // deleteMessage(messageId: number): Observable<Message> {
  //   return this.http.delete<Message>(
  //     this.endpoint + `/api/messages/${messageId}`
  //   );
  // }

  // upvoteMessage(messageId: number) {
  //   return this.http.patch<Message>(
  //     this.endpoint + `/api/messages/${messageId}`, {
  //       action: "upvote"
  //     }
  //   )
  // }

  // downvoteMessage(messageId: number) {
  //   return this.http.patch<Message>(
  //     this.endpoint + `/api/messages/${messageId}`, {
  //       action: "downvote"
  //     }
  //   )
  // }

  // signIn(username: string, password: string) {
  //   return this.http.post(
  //     this.endpoint + "/users/signin",{
  //       username: username,
  //       password:password
  //     })
  // }

  // signUp(username: string, password: string) {
  //   return this.http.post(
  //     this.endpoint + "/users/signup", {
  //       username: username,
  //       password: password
  //     }
  //   )
  // }

  // signOut() {
  //   return this.http.get(
  //     this.endpoint + "/users/signout"
  //   )
  // }
}
