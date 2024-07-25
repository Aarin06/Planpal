import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from '../../classes/message';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  isLoginPopupvisible: boolean = false;

  constructor() {}

  handleOpenLogin(event: boolean) {
    if (event) {
      this.isLoginPopupvisible = true;
    }
  }

  handleExitLogin(event: boolean) {
    if (!event) {
      this.isLoginPopupvisible = false;
    }
  }
}
