import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../classes/message';

/**
 * Note how this component does not make any HTTP calls, even though it has buttons to
 * upvote, downvote, and delete a message. Instead, it emits these events back to the parent component
 * (index.component.html) to handle.
 *
 * We call this component a "dumb component" in the "smart-dumb component" pattern.
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;
  @Output() upvote = new EventEmitter<number>();
  @Output() downvote = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  downvoteMessage() {
    this.downvote.emit(this.message.id);
  }

  upvoteMessage() {
    this.upvote.emit(this.message.id);
  }

  deleteMessage() {
    this.delete.emit(this.message.id);
  }
}
