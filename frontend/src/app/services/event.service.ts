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
  providedIn: 'root'
})
export class EventService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  getEvent(eventId: number): Observable<DBEvent>{
    return this.http.get<DBEvent>(
      this.endpoint + `/events/${eventId}`
    )
  }

  patchEvent(eventId: number, eventData: Event): Observable<DBEvent> {
    return this.http.patch<DBEvent>(
      this.endpoint + `/events/${eventId}`, eventData
    );
  }

  deleteEvent(eventId: number): Observable<DBEvent> {
    return this.http.delete<DBEvent>(
      this.endpoint + `/events/${eventId}`
    );
  }
}
