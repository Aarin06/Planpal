import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrl: './payment-error.component.scss'
})
export class PaymentErrorComponent {
  constructor(private router: Router){}
  redirectHome(){
    this.router.navigate(['/home'])
  }
}
