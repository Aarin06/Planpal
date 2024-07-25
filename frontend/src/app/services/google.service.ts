import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Itinerary } from '../classes/itinerary';
import { Event } from '../classes/event';
import { ItineraryMember } from '../classes/itinerarymember';
import { placesSearchResult } from '../classes/placesSearchResult';
import { DBEvent } from '../classes/dbEvent';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  getEventRecommendations(location: {
    lat: number;
    lng: number;
  }): Observable<any> {
    return this.http.post(this.endpoint + `/google/places`, {
      location: location,
    });
  }
}
