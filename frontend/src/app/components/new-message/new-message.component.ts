import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * This component shows a very simple way of setting up a Form in Angular.
 * It makes use of the ReactiveFormsModule (app.module.ts) with a FormBuilder
 * dependency injection.
 *
 * Also - notice that this component does not make an API call - it is a "dumb component" in the
 * "smart-dumb component" pattern.
 */
@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit {
  @Output() newMessage = new EventEmitter<string>();

  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      /**
       * In Angular we can easily define a form field with validators, without installing 9 billion more
       * packages.
       *
       * Add your fields here
       */
      message: ['', []],
    });
  }

  ngOnInit(): void {}

  postMessage() {
    this.newMessage.emit(this.messageForm.value.message);
  }
}
