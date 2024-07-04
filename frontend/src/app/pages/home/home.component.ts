import { Component, OnInit } from '@angular/core';
import { Itinerary } from '../../classes/itinerary';
import { ItineraryService } from '../../services/itinerary.service';
import { Router } from '@angular/router';
import {format} from 'date-fns'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  value = '';
  itineraries: any[] = []
  constructor(private itineraryApi: ItineraryService, private router:Router) { }

  ngOnInit(): void {
    this.getItineraries();
  }

  getItineraries(){
    this.itineraryApi.getItineraries().subscribe((response) =>{
      console.log(response)
      this.itineraries = response.itineraries;

      this.itineraries.map(itinerary =>{
        this.itineraryApi.getItineraryMembers(itinerary.id).subscribe((res) =>{
          itinerary.members = res
        })
        itinerary.startDate = format(new Date(itinerary.startDate), 'MMM dd yyyy');
        itinerary.endDate = format(new Date(itinerary.endDate), 'MMM dd yyyy');

        return itinerary;      
      })
      console.log(this.itineraries)

    })

    
  }

  navigateAddItinerary(){
    this.router.navigate(['/create-itinerary'])
  }

}
