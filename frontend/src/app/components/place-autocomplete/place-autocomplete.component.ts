import { Component, OnInit, Input, ViewChild, ElementRef, Output,EventEmitter} from '@angular/core';
import { placesSearchResult } from '../../classes/placesSearchResult';

@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.scss'
})
export class PlaceAutocompleteComponent implements OnInit {
  @ViewChild('inputField')
  inputField!: ElementRef;
  @Input() placeholder = '';
  @Output() placeChanged = new EventEmitter<placesSearchResult>();

  constructor(){}

  autocomplete: google.maps.places.Autocomplete | undefined;

  ngOnInit():void {}

  ngAfterViewInit(){
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement)

    this.autocomplete.addListener('place_changed', () =>{
      const place = this.autocomplete?.getPlace();
      const result:placesSearchResult = {
        address: this.inputField.nativeElement.value,
        name: place?.name,
        location:place?.geometry?.location,
        iconUrl:place?.icon,
        imageUrl:this.getPhotoUrl(place)
      }
      this.placeChanged.emit(result);
    })

  }

  getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined {
    return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({maxWidth: 500}) : undefined
  } 
}
 