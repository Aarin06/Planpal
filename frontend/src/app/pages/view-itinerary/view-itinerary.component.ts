import { Component, ElementRef, Renderer2 } from '@angular/core';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary } from '../../classes/itinerary';
import { DBEvent } from '../../classes/dbEvent';
import { Event } from '../../classes/event';

@Component({
  selector: 'app-view-itinerary',
  templateUrl: './view-itinerary.component.html',
  styleUrl: './view-itinerary.component.scss'
})
export class ViewItineraryComponent {
  isCustomEventFormVisible: boolean = false
  isEventPreviewVisible: boolean = false
  calendarEventArgs: any = null;
  calendarEventClickArgs: any = null
  itineraryId: number | null = null;
  itinerary: Itinerary & {Events: DBEvent[]} | null = null;

  constructor(private renderer: Renderer2, 
    private el: ElementRef, 
    private route: ActivatedRoute, 
    private itineraryApi: ItineraryService) {}

  ngOnInit(): void {
    this.itineraryId = Number(this.route.snapshot.paramMap.get('itineraryId'));
    if (!this.itineraryId){
    } else {
      this.itineraryApi.getItinerary(this.itineraryId).subscribe((response) => {
        this.itinerary = response
      })
    }
  }

  get initialItinerary(): Itinerary & {Events: DBEvent[]} | null{
    return this.itinerary ? this.itinerary : null
  }

  handlePlaceChanged(place: placesSearchResult) {

    const newEvent = {
      title: place.name ? place.name : "Event",
      start: String(new Date),
      end: String(new Date),
      allDay: true,
      extendedProps: {
        location: place
      }
    }
    this.createDraggableElement(place, newEvent);
  }

  private createDraggableElement(place: placesSearchResult, event: Event) {
    const draggableDiv = this.renderer.createElement('div');
    this.renderer.addClass(draggableDiv, 'fc-event');
    this.renderer.setProperty(draggableDiv, 'innerText', 
      `${place.name}
      ${place.address}`);
      this.renderer.setAttribute(draggableDiv, 'data-props', JSON.stringify(event));
    this.renderer.appendChild(this.el.nativeElement.querySelector('.add-item'), draggableDiv);
  }

  handleCalendarEvent(event: any){
    this.calendarEventArgs = event
  }

  handleCalendarEventClick(event: any){
    this.calendarEventClickArgs = event
  }

  handleOpenCustomEventForm(event: boolean){
    if(event){
      this.isCustomEventFormVisible = true;
    }
  }

  handleExitCustomEventForm(event: boolean) {
    if (!event) {
      this.isCustomEventFormVisible = false;
    }
  }

  handleOpenEventPreviewForm(event: boolean){
    if(event){
      this.isEventPreviewVisible = true;
    }
  }

  handleExitEventPreviewForm(event: boolean) {
    if (!event) {
      this.isEventPreviewVisible = false;
    }
  }

}
