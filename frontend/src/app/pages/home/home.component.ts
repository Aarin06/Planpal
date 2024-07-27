import { Component, OnInit } from '@angular/core';
import { ItineraryService } from '../../services/itinerary.service';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ApiService } from '../../services/api.service';
import { user } from '../../classes/user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchKeyword = '';
  itineraries: any[] = [];
  filteredItineraries: any[] = [];
  user: user | undefined;
  constructor(
    private api: ApiService,
    private itineraryApi: ItineraryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getItineraries();
  }

  getUser() {
    this.api.me().subscribe({
      next: (value) => {
        this.user = value;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getItineraries() {
    this.itineraryApi.getItineraries().subscribe((response) => {
      this.itineraries = response.itineraries;
      this.itineraries.map((itinerary) => {
        this.itineraryApi.getItineraryMembers(itinerary.id).subscribe((res) => {
          itinerary.members = res;
        });
        itinerary.startDate = format(
          new Date(itinerary.startDate),
          'MMM dd yyyy',
        );
        itinerary.endDate = format(new Date(itinerary.endDate), 'MMM dd yyyy');

        return itinerary;
      });
      this.filterItineraries();
    });
  }

  filterItineraries() {
    if (!this.searchKeyword) {
      this.filteredItineraries = this.itineraries;
    } else {
      this.filteredItineraries = this.itineraries.filter((itinerary) =>
        itinerary.title
          .toLowerCase()
          .includes(this.searchKeyword.toLowerCase()),
      );
    }
  }

  onSearchKeywordChange() {
    this.filterItineraries();
  }

  navigateAddItinerary() {
    this.router.navigate(['/create-itinerary']);
  }

  removeItinerary(itineraryId: number): void {
    this.itineraries = this.itineraries.filter(itinerary => itinerary.id !== itineraryId);
    this.filteredItineraries = this.filteredItineraries.filter(itinerary => itinerary.id !== itineraryId);
  }
  
}
