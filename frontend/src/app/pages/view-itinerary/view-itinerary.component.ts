import { Component, ElementRef, Renderer2 } from '@angular/core';
import { placesSearchResult } from '../../classes/placesSearchResult';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary } from '../../classes/itinerary';
import { Event } from '../../classes/event';

@Component({
  selector: 'app-view-itinerary',
  templateUrl: './view-itinerary.component.html',
  styleUrl: './view-itinerary.component.scss'
})
export class ViewItineraryComponent {
  isCustomEventFormVisible: boolean = false
  calendarEventArgs: any = null;
  event: placesSearchResult | null = null
  itineraryId: number | null = null;
  itinerary: Itinerary & {events: Event[]} | null = null;

  constructor(private renderer: Renderer2, 
    private el: ElementRef, 
    private route: ActivatedRoute, 
    private itineraryApi: ItineraryService) {}

  ngOnInit(): void {
    this.itineraryId = Number(this.route.snapshot.paramMap.get('itineraryId'));
    console.log(this.itineraryId)
    if (!this.itineraryId){
      console.log("no itinerary id in the url")
    } else {
      this.itineraryApi.getItinerary(this.itineraryId).subscribe((response) => {
        console.log("This is the itinerary object")
        console.log(response)
        console.log(typeof response.startDate)
        this.itinerary = response
      })
    }
  }

  get startDateAsDate(): Date | null {
    if (this.itinerary && this.itinerary.startDate) {
      return new Date(this.itinerary.startDate);
    }
    return null;
  }

  handlePlaceChanged(place: placesSearchResult) {
    this.event = place
    this.createDraggableElement(this.event.address);
  }

  private createDraggableElement(address: string) {
    const draggableDiv = this.renderer.createElement('div');
    this.renderer.addClass(draggableDiv, 'fc-event');
    this.renderer.setProperty(draggableDiv, 'innerText', address);
    this.renderer.appendChild(this.el.nativeElement.querySelector('.add-item'), draggableDiv);
  }

  handleCalendarEvent(event: any){
    this.calendarEventArgs = event
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

}
