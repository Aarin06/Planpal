import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Itinerary } from '../classes/itinerary';

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
      this.endpoint + `/itineraries`
    );
  }

  getItinerary(itineraryId: number): Observable<Itinerary> {
    return this.http.get<Itinerary>(
      this.endpoint + `/itineraries${itineraryId}`
    );
  }

  createItinerary(itineraryData: { location: string; startDate: Date; endDate: Date; description?: string }): Observable<Itinerary> {
    console.log("tData",itineraryData)
    return this.http.post<Itinerary>(this.endpoint + '/itineraries', {
      location: itineraryData.location,
      startDate: itineraryData.startDate,
      endDate: itineraryData.endDate,
      description: itineraryData.description,
    });
  }

  deleteItinerary(itineraryId: number): Observable<Itinerary> {
    return this.http.delete<Itinerary>(
      this.endpoint + `/itineraries/${itineraryId}`
    );
  }

  updateItinerary(itineraryId: number, startDate: Date, endDate: Date, description: string) {
    return this.http.patch<Itinerary>(
      this.endpoint + `/itineraries/${itineraryId}`,{
        startDate, endDate, description
      }
    )
  }

}
