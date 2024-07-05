import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Output() openLoginForm = new EventEmitter<boolean>();
  faLocationDot = faLocationDot
  value = '';
  isAuth: boolean = false;
  
  constructor(private router: Router, private api:ApiService) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  onOpenLogin() {
    this.openLoginForm.emit(true);
  }

  goToTrips(){
    this.router.navigate(['/']);
  }

  checkAuth() {
    this.api.me().subscribe({
      next: () => {
        this.isAuth = true
      }, error: (err) =>{
        console.log(err)
      }
    })
  }

}
