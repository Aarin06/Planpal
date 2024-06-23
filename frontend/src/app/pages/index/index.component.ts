import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from '../../classes/message';

/**
 * The index component is responsible for handling everything that a user can do in the home page.
 *
 * In this case, we are able to:
 * - create a new message
 * - upvote, downvote a message
 * - delete a message
 *
 * Note how this component makes all the API calls, but if you take a look at the .html.ts file, it does not
 * define at all how this page looks like. This is called a "smart component" in the "smart-dumb component" pattern.
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  messages: Message[] = [];
  error: string = '';
  isAuth: boolean = false;
  isLoginPopupvisible: boolean = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getMessages();
    this.checkAuth();
  }

  handleOpenLogin(event: boolean){
    if(event){
      this.isLoginPopupvisible = true;
    }
  }

  handleExitLogin(event: boolean) {
    if (!event) {
      this.isLoginPopupvisible = false;
    }
  }

  getMessages() {
    /**
     * Angular uses Observables instead of Promises, but works very similarly to it. Instead of .then(),
     * we use .subscribe() to listen to the response.
     */
    this.api.getMessages().subscribe((response) => {
      this.messages = response.messages;
    });
  }

  /**
   * Angular uses observables instead of promises, but works very similarly to it.
   * You can use this as a reference for how to use observables.
   * @param content The content of the message
   */
  postMessage(content: string) {
    this.api.addMessage(content).subscribe({
      next: () => {
        this.getMessages();
        this.error = '';
      },
      error: (err) => {
        this.error = err.error.error;
      },
    });
  }

  downvoteMessage(messageId: number) {
    this.api.downvoteMessage(messageId).subscribe({
      next: () => {
        this.getMessages();
        this.error = '';
      },error: (err) => {
        this.error = err.error.error;
      },
    })
  }

  upvoteMessage(messageId: number) {
    this.api.upvoteMessage(messageId).subscribe({
      next: () => {
        this.getMessages();
        this.error = '';
      },error: (err) => {
        this.error = err.error.error;
      },
    })
  }

  deleteMessage(messageId: number) {
    this.api.deleteMessage(messageId).subscribe({
      next: () => {
        this.getMessages();
        this.error = '';
      },error: (err) => {
        this.error = err.error.error;
      },
    })
  }

  checkAuth() {
    this.api.me().subscribe({
      next: () => {
        this.isAuth = true
      }, error: (err) =>{
        console.log(err)
        this.error = err.error.error;
      }
    })
  }
}
