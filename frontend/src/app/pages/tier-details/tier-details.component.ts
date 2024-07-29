import { Component } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tier-details',
  templateUrl: './tier-details.component.html',
  styleUrl: './tier-details.component.scss',
})
export class TierDetailsComponent {
  faCheck = faCheck;
  faStar = faStar;

  constructor(private router: Router) {}

  async redirectToPayment() {
    const res = await fetch(
      'http://localhost:3000/stripe/create-checkout-session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );

    const body = await res.json();
    window.location.href = body.url;
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
