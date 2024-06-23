import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {
  @Output() openLoginForm = new EventEmitter<boolean>();
  faGoogle = faGoogle
  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  onGoogleLogin() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  onExitLogin(): void {
    this.openLoginForm.emit(false);
  }

}
