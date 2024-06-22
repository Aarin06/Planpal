import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { GoogleApiService, UserInfo } from 'src/app/services/google-api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  userInfo? : UserInfo
  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private readonly googleApi: GoogleApiService) {
    this.signInForm = this.fb.group({
      username: ['', []],
      password: ['', []]
    })

    this.signUpForm = this.fb.group(
      {
        username: ['', []],
        password: ['', []]
      }
    )

    googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
    })
  }

  ngOnInit(): void {}

  signIn() {
    this.api.signIn(this.signInForm.value.username, this.signInForm.value.password).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err.error)
      }
    })
    
  }
  signUp() {
    this.api.signUp(this.signUpForm.value.username, this.signUpForm.value.password).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }
}
