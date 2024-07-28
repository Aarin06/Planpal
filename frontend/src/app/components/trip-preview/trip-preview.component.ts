import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ItineraryService } from '../../services/itinerary.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trip-preview',
  templateUrl: './trip-preview.component.html',
  styleUrls: ['./trip-preview.component.scss'],
})
export class TripPreviewComponent implements OnInit {
  @Input() itinerary!: any;
  @Output() itineraryDeleted = new EventEmitter<number>();
  faTrash = faTrash


  isOwner:boolean = true; // Placeholder value

  constructor(private router: Router, private itineraryApi: ItineraryService) {}

  ngOnInit(): void {
  }

  navigateToItineraryDetails(itineraryId: number): void {
    this.router.navigate(['/view-itinerary', itineraryId]);
  }

  deleteItinerary(event: Event, itineraryId: number): void {
    event.stopPropagation(); // Prevent the card click event
    this.itineraryApi.deleteItinerary(itineraryId).subscribe({
      next: () => {
        // Handle successful deletion
        this.itineraryDeleted.emit(itineraryId);
      },
      error: (err) => {
        // Handle error
        console.error(`Error deleting itinerary ${itineraryId}`, err);
      },
    });
  }
}
