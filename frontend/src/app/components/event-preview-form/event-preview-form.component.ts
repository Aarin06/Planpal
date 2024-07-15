import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createEventId } from '../calendar/event-utils';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ItineraryService } from '../../services/itinerary.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-preview-form',
  templateUrl: './event-preview-form.component.html',
  styleUrl: './event-preview-form.component.scss'
})
export class EventPreviewFormComponent {
  @Output() openEventPreview = new EventEmitter<boolean>();
  @Input() calendarEventClickArgs: any = null;
  @Input() itineraryId: number | null = null;

  eventForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private itineraryApi: ItineraryService, private eventApi: EventService ) {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      location: ['', Validators.required],
      // description: ['']
    });
  }
  ngOnInit(): void {
    this.eventApi.getEvent(this.calendarEventClickArgs.event.id).subscribe({
      next: (value) => {
        console.log(typeof value.location.address)
        this.eventForm.get('eventName')?.setValue(value.title)
        this.eventForm.get('location')?.setValue(value.location.address)
      }, error(err) {
        console.log(err)
      },
    }
    )
  }

  onExitForm(): void {
    this.openEventPreview.emit(false);
  }

  updateEvent(): void {
    const formValues = this.eventForm.value;
  
    if (this.eventForm.valid && this.itineraryId) {
      const calendarApi = this.calendarEventClickArgs?.view?.calendar;
      if (calendarApi) {
        const selectInfo = this.calendarEventClickArgs; // You might need to adjust this based on how selectInfo is passed or stored
        const event = {
          id: -1,
          title: formValues.eventName,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          extendedProps: {
            location: formValues.location
          }
        }
        // Step 3: Create Event
        this.itineraryApi.createEvent(this.itineraryId, event).subscribe({
          next: (res) => {
            event.id = res.id
            console.log(event)
            calendarApi.addEvent(event);
          },
          error: (err) =>{
            console.log(err)
            return
          }
        })
        // Step 4: Reset Form (optional)
        this.eventForm.reset();
        // Step 5: Emit Event (if needed, for example, to close the form)
        this.openEventPreview.emit(false);
      }
    } else {
      // Handle form invalid case
      console.error('Information is invalid');
    }
  }

  handleDeleteEvent(){
    this.eventApi.deleteEvent(this.calendarEventClickArgs.event.id).subscribe({
      next: () => {
        this.calendarEventClickArgs.event.remove();
        this.onExitForm();
      },
      error(err) {
          console.log(err)
      },
    })
  }

  handlePlaceChanged(place: placesSearchResult) {
    this.eventForm.patchValue({
      location: place // Update the location form control
    });
  }
}
