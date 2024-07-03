import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() isAuth: boolean = false
  @Output() openLoginForm = new EventEmitter<boolean>();
  faLocationDot = faLocationDot
  value = '';
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onOpenLogin() {
    this.openLoginForm.emit(true);
  }

  goToTrips(){
    this.router.navigate(['/']);
  }

}
