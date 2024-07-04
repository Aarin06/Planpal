import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-preview',
  templateUrl: './trip-preview.component.html',
  styleUrls: ['./trip-preview.component.scss']
})
export class TripPreviewComponent implements OnInit {
  @Input() itinerary!: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToItineraryDetails(itineraryId: number): void {
    this.router.navigate(['/view-itinerary', itineraryId]);
  }
}
