import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ItineraryService } from '../../services/itinerary.service';
import { Router } from '@angular/router';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-itinerary-setup',
  templateUrl: './itinerary-setup.component.html',
  styleUrls: ['./itinerary-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItinerarySetupComponent implements OnInit {
  readonly range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  newLocation: google.maps.LatLng = new google.maps.LatLng(0 ,0);
  itineraryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private itineraryApi: ItineraryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.itineraryForm = this.fb.group({
      title: ['', Validators.required],
      location: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  createItinerary() {
    if (this.itineraryForm.valid) {
      // Handle form submission logic here
      this.itineraryApi.createItinerary(this.itineraryForm.value).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err.error)
          this.snackBar.open(err.error.error)
        },
      });
    } else {
      this.snackBar.open("Form is invalid")
    }
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  handlePlaceChanged(place: placesSearchResult) {
    this.itineraryForm.patchValue({
      location: place, // Update the location form control
    });
    if (place.location) {
      this.newLocation = place.location;
      this.cdRef.markForCheck();
    }
  }
}
