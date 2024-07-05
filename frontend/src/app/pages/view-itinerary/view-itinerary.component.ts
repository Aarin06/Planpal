import { Component, ElementRef, Renderer2 } from '@angular/core';
import { placesSearchResult } from '../../classes/placesSearchResult';

@Component({
  selector: 'app-view-itinerary',
  templateUrl: './view-itinerary.component.html',
  styleUrl: './view-itinerary.component.scss'
})
export class ViewItineraryComponent {
  event: placesSearchResult | null = null
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  handlePlaceChanged(place: placesSearchResult) {
    this.event = place
    this.createDraggableElement(this.event.address);

    console.log(this.event)
  }

  private createDraggableElement(address: string) {
    const draggableDiv = this.renderer.createElement('div');
    this.renderer.addClass(draggableDiv, 'fc-event');
    this.renderer.setProperty(draggableDiv, 'innerText', address);
    this.renderer.appendChild(this.el.nativeElement.querySelector('.add-item'), draggableDiv);
  }

}
