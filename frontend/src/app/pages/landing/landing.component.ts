import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @Output() openLoginForm = new EventEmitter<boolean>();
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  handleGetStarted() {
    this.api.me().subscribe({
      next: () => {
        this.router.navigate(['/home'])
      }, error: () => {
        this.openLoginForm.emit(true)
      },
    })
    
  }
}
