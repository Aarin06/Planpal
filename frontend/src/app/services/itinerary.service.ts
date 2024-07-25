import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Itinerary } from '../classes/itinerary';
import { ItineraryMember } from '../classes/itinerarymember';
import { placesSearchResult } from '../classes/placesSearchResult';
import { Event } from '../classes/event';
import { DBEvent } from '../classes/dbEvent';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */

  getItineraries(): Observable<{ itineraries: Itinerary[] }> {
    return this.http.get<{ itineraries: Itinerary[] }>(
      this.endpoint + `/itineraries`,
    );
  }

  getItineraryMembers(
    itineraryId: number,
  ): Observable<{ itineraryMembers: ItineraryMember[] }> {
    return this.http.get<{ itineraryMembers: ItineraryMember[] }>(
      this.endpoint + `/itineraries/${itineraryId}/members`,
    );
  }

  getItinerary(
    itineraryId: number,
  ): Observable<Itinerary & { Events: DBEvent[] }> {
    return this.http.get<Itinerary & { Events: DBEvent[] }>(
      this.endpoint + `/itineraries/${itineraryId}`,
    );
  }

  createItinerary(itineraryData: {
    title: string;
    location: placesSearchResult;
    startDate: Date;
    endDate: Date;
    description?: string;
  }): Observable<Itinerary> {
    return this.http.post<Itinerary>(this.endpoint + '/itineraries', {
      location: itineraryData.location,
      startDate: itineraryData.startDate,
      endDate: itineraryData.endDate,
      description: itineraryData.description,
      title: itineraryData.title,
    });
  }

  createEvent(itineraryId: number, eventData: Event): Observable<DBEvent> {
    return this.http.post<DBEvent>(
      this.endpoint + `/itineraries/${itineraryId}/event`,
      eventData,
    );
  }

  deleteItinerary(itineraryId: number): Observable<Itinerary> {
    return this.http.delete<Itinerary>(
      this.endpoint + `/itineraries/${itineraryId}`,
    );
  }

  updateItinerary(
    itineraryId: number,
    startDate: Date,
    endDate: Date,
    description: string,
  ) {
    return this.http.patch<Itinerary>(
      this.endpoint + `/itineraries/${itineraryId}`,
      {
        startDate,
        endDate,
        description,
      },
    );
  }
}
