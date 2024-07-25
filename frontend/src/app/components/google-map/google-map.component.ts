import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnChanges {
  @Input() location: google.maps.LatLng | undefined;
  map: google.maps.Map | undefined;

  ngOnInit(): void {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 0, lng: 0 },
        zoom: 8,
        mapId: '6449a671c2187789',
      },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['location']);
    if (changes['location']) {
      this.changeLocation();
    }
  }

  async changeLocation(): Promise<void> {
    if (this.location) {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker',
      )) as google.maps.MarkerLibrary;
      this.map?.setCenter(this.location);
      new AdvancedMarkerElement({
        map: this.map,
        position: this.location,
      });
    }
  }
}
