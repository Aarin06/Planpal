import {
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary } from '../../classes/itinerary';
import { DBEvent } from '../../classes/dbEvent';
import { Event } from '../../classes/event';
import { GoogleService } from '../../services/google.service';
import { ApiService } from '../../services/api.service';
import { user } from '../../classes/user';

@Component({
  selector: 'app-view-itinerary',
  templateUrl: './view-itinerary.component.html',
  styleUrl: './view-itinerary.component.scss',
})
export class ViewItineraryComponent {
  @Output() openCollaboratorForm = new EventEmitter<boolean>();

  user: user | undefined;
  isCustomEventFormVisible: boolean = false;
  isEventPreviewVisible: boolean = false;
  isCollaboratorsFormVisible: boolean = false;
  calendarEventArgs: any = null;
  calendarEventClickArgs: any = null;
  itineraryId: number | null = null;
  itinerary: (Itinerary & { Events: DBEvent[] }) | null = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute,
    private itineraryApi: ItineraryService,
    private googleApi: GoogleService,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.itineraryId = Number(this.route.snapshot.paramMap.get('itineraryId'));
    this.getUser();
    if (!this.itineraryId) {
      console.log('No itinerary Id provided in url');
    } else {
      this.itineraryApi.getItinerary(this.itineraryId).subscribe((response) => {
        this.itinerary = response;
        this.getRecommendations(this.itinerary.location.location);
      });
    }
  }

  getUser() {
    this.api.me().subscribe({
      next: (value) => {
        this.user = value;
        console.log('im getting the user here');
        console.log(this.user);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  get initialItinerary(): (Itinerary & { Events: DBEvent[] }) | null {
    return this.itinerary ? this.itinerary : null;
  }

  onOpenLogin() {
    this.openCollaboratorForm.emit(true);
  }

  getRecommendations(location: { lat: number; lng: number }) {
    this.googleApi.getEventRecommendations(location).subscribe({
      next: (value) => {
        value.forEach((event: DBEvent) => {
          const newEvent = {
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            extendedProps: {
              location: event.location,
            },
          };
          this.createDraggableElement(newEvent);
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }

  handlePlaceChanged(place: placesSearchResult) {
    // const newEvent = {
    //   title: place.name ? place.name : "Event",
    //   start: String(new Date),
    //   end: String(new Date),
    //   allDay: true,
    //   extendedProps: {
    //     location: place
    //   }
    // }
    // this.createDraggableElement(newEvent);
    const location = {
      lat: place.location?.lat() ?? 0,
      lng: place.location?.lng() ?? 0,
    };
    const addItemElement = this.el.nativeElement.querySelector('.add-item');
    if (addItemElement) {
      addItemElement.innerHTML = '';
    }
    this.getRecommendations(location);
  }

  private createDraggableElement(event: Event) {
    const draggableDiv = this.renderer.createElement('div');
    this.renderer.addClass(draggableDiv, 'fc-event');
    this.renderer.setProperty(
      draggableDiv,
      'innerText',
      `${event.title}
      ${event.extendedProps.location.address}`,
    );
    this.renderer.setAttribute(
      draggableDiv,
      'data-props',
      JSON.stringify(event),
    );
    this.renderer.appendChild(
      this.el.nativeElement.querySelector('.add-item'),
      draggableDiv,
    );
  }

  handleCalendarEvent(event: any) {
    this.calendarEventArgs = event;
  }

  handleCalendarEventClick(event: any) {
    this.calendarEventClickArgs = event;
  }

  handleOpenCustomEventForm(event: boolean) {
    if (event) {
      this.isCustomEventFormVisible = true;
    }
  }

  handleExitCustomEventForm(event: boolean) {
    if (!event) {
      this.isCustomEventFormVisible = false;
    }
  }

  handleOpenEventPreviewForm(event: boolean) {
    if (event) {
      this.isEventPreviewVisible = true;
    }
  }

  handleExitEventPreviewForm(event: boolean) {
    if (!event) {
      this.isEventPreviewVisible = false;
    }
  }

  handleOpenCollaboratorsForm(event: boolean) {
    if (event) {
      this.isCollaboratorsFormVisible = true;
    }
  }

  handleExitCollaboratorsForm(event: boolean) {
    if (!event) {
      this.isCollaboratorsFormVisible = false;
    }
  }
}
