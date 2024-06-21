import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
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
}
