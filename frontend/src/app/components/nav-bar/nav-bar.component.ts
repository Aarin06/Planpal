import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Output() openLoginForm = new EventEmitter<boolean>();
  faLocationDot = faLocationDot;
  value = '';
  isAuth: boolean = false;
  tier: number = 1;

  constructor(
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  onOpenLogin() {
    this.openLoginForm.emit(true);
  }

  onOpenUpgrade() {
    this.router.navigate(['tier']);
  }

  onSignOut() {
    this.api.signOut().subscribe({
      next: () => {
        this.isAuth = false;
        this.router.navigate(['/']);
      }
    });
  }

  goToTrips() {
    this.router.navigate(['/home']);
  }

  checkAuth() {
    this.api.me().subscribe({
      next: (res) => {
        this.isAuth = true;
        this.tier = res.tier;
      }
    });
  }
}
