import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createEventId } from '../calendar/event-utils';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ItineraryService } from '../../services/itinerary.service';
@Component({
  selector: 'app-custom-event-form',
  templateUrl: './custom-event-form.component.html',
  styleUrl: './custom-event-form.component.scss',
})
export class CustomEventFormComponent {
  @Output() openCustomEventForm = new EventEmitter<boolean>();
  @Input() calendarEventArg: any = null;
  @Input() itineraryId: number | null = null;
  newLocation: google.maps.LatLng | undefined;

  eventForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private api: ItineraryService,
  ) {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      location: ['', Validators.required],
      // description: [''],
    });
  }

  onExitForm(): void {
    this.openCustomEventForm.emit(false);
  }

  createCustomEvent(): void {
    const formValues = this.eventForm.value;

    if (this.eventForm.valid && this.itineraryId) {
      const calendarApi = this.calendarEventArg?.selectInfo?.view?.calendar;
      if (calendarApi) {
        const selectInfo = this.calendarEventArg.selectInfo; // You might need to adjust this based on how selectInfo is passed or stored
        const event = {
          id: -1,
          title: formValues.eventName,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          extendedProps: {
            location: formValues.location,
          },
        };
        console.log(formValues.location);
        // Step 3: Create Event
        this.api.createEvent(this.itineraryId, event).subscribe({
          next: (res) => {
            event.id = res.id;
            console.log(event);
            calendarApi.addEvent(event);
            let sendEvent = {
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              extendedProps: event.extendedProps
            }

            this.calendarEventArg.socket.emit('createEvent', event);
          },
          error: (err) => {
            console.log(err);
            return;
          },
        });
        // Step 4: Reset Form (optional)
        this.eventForm.reset();
        // Step 5: Emit Event (if needed, for example, to close the form)
        this.onExitForm();
      }
    } else {
      // Handle form invalid case
      console.error('Information is invalid');
    }
  }

  handlePlaceChanged(place: placesSearchResult) {
    this.eventForm.patchValue({
      location: place, // Update the location form control
    });
    if (place.location) {
      this.newLocation = place.location;
      console.log(this.newLocation);
      this.cdRef.markForCheck();
    }
  }
}
