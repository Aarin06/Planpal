import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary } from '../../classes/itinerary';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-itinerary-form',
  templateUrl: './edit-itinerary-form.component.html',
  styleUrl: './edit-itinerary-form.component.scss'
})
export class EditItineraryFormComponent {
  @Output() openItineraryPreview = new EventEmitter<boolean>();
  @Input() itineraryId: number | null = null;
  newLocation: google.maps.LatLng = new google.maps.LatLng(0 ,0);

  range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  itineraryForm: FormGroup;
  initalItineraryData: Itinerary | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private itineraryApi: ItineraryService,
    private snackBar: MatSnackBar
  ) {
    this.itineraryForm = this.formBuilder.group({
      title: ['', Validators.required],
      location: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.itineraryId){
      return
    }
    this.itineraryApi
      .getItinerary(this.itineraryId)
      .subscribe({
        next: (value) => {
          console.log("here")
          console.log(value)
          console.log(new Date(value.startDate))
          this.newLocation = new google.maps.LatLng(value.location.location.lat, value.location.location.lng);
          this.itineraryForm.get('title')?.setValue(value.title);
          this.itineraryForm.get('location')?.setValue(value.location.address);
          this.range.patchValue({
            startDate: new Date(value.startDate),
            endDate: new Date(value.endDate)
          });
          this.itineraryForm.get('description')?.setValue(value.description);
          this.initalItineraryData = value;
        },
        error(err) {
          console.log(err);
        },
      });
  }

  onExitForm(): void {
    this.openItineraryPreview.emit(false);
    // this.calendarItineraryClickArgs.socket.emit(
    //   'closeFormItinerary',
    //   this.calendarItineraryClickArgs.clickInfo.itinerary,
    // );
  }

  updateItinerary(): void {
    const formValues = this.itineraryForm.value;

    if (this.itineraryForm.valid && this.itineraryId) {
      // const prevItinerary = this.calendarItineraryClickArgs.clickInfo.itinerary;
      // if (prevItinerary) {

        const newItinerary: Itinerary = {
          title: this.itineraryForm.value.title,
          startDate: this.itineraryForm.value.startDate,
          endDate: this.itineraryForm.value.endDate,
          description: this.itineraryForm.value.description,
          location: this.itineraryForm.value.location
        }
        
        this.itineraryApi.updateItinerary(this.itineraryId, newItinerary).subscribe({
          next: (res) => {
            console.log(res);

            // let sendItinerary = {
            //   id: this.itineraryId,
            //   title: newItinerary.title,
            //   start: prevItinerary.itinerary.start,
            //   end: prevItinerary.itinerary.end,
            //   allDay: prevItinerary.itinerary.allDay,
            //   extendedProps: newItinerary.extendedProps,
            // };

            // this.calendarItineraryClickArgs.socket.emit('updateItinerary', sendItinerary);
          },
          error: (err) => {
            this.snackBar.open(err.error.error)
            return;
          },
        });
        this.itineraryForm.reset();
        this.openItineraryPreview.emit(false);
      // }
    } else {
      this.snackBar.open("Something went wrong in updating the itinerary. Please try again later.")
    }
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
