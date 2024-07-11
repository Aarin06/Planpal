import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createEventId } from '../calendar/event-utils';
import { placesSearchResult } from '../../classes/placesSearchResult';
@Component({
  selector: 'app-custom-event-form',
  templateUrl: './custom-event-form.component.html',
  styleUrl: './custom-event-form.component.scss'
})
export class CustomEventFormComponent {
  @Output() openCustomEventForm = new EventEmitter<boolean>();
  @Input() calendarEventArg: any = null;

  eventForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
    });
  }

  onExitForm(): void {
    this.openCustomEventForm.emit(false);
  }

  createCustomEvent(): void {
    const formValues = this.eventForm.value;
  
    if (this.eventForm.valid) {
      const calendarApi = this.calendarEventArg?.view?.calendar;
      if (calendarApi) {
        const selectInfo = this.calendarEventArg; // You might need to adjust this based on how selectInfo is passed or stored
        const eventId = createEventId(); // Assuming createEventId is a function available in your context
        
        console.log(formValues.location)
        // Step 3: Create Event
        calendarApi.addEvent({
          id: eventId,
          title: formValues.eventName,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          location: formValues.location,
          description: formValues.description
        });
  
        // Step 4: Reset Form (optional)
        this.eventForm.reset();
  
        // Step 5: Emit Event (if needed, for example, to close the form)
        this.openCustomEventForm.emit(false);
      }
    } else {
      // Handle form invalid case
      console.error('Form is invalid');
    }
  }

  handlePlaceChanged(place: placesSearchResult) {
    this.eventForm.patchValue({
      location: place // Update the location form control
    });
  }
}
