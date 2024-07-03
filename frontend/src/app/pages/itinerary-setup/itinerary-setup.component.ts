import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ItineraryService } from '../../services/itinerary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itinerary-setup',
  templateUrl: './itinerary-setup.component.html',
  styleUrls: ['./itinerary-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItinerarySetupComponent implements OnInit {

  readonly range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  
  itineraryForm: FormGroup;


  constructor(private fb: FormBuilder, private itineraryApi:ItineraryService, private router:Router) {
    this.itineraryForm = this.fb.group({
      location: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [''],
    });
  }

  
  ngOnInit(): void {
  }

  createItinerary() {
    if (this.itineraryForm.valid) {
      // Handle form submission logic here
      this.itineraryApi.createItinerary(this.itineraryForm.value).subscribe({
        next: () => {
          this.router.navigate(['/'])
          console.log('Form Submitted', this.itineraryForm.value);
        }, error: (err) =>{
          console.log(err)
          
        }
      })

    } else {
      console.log('Form is invalid',this.itineraryForm.value)
    }
  }

  navigateHome(){
    this.router.navigate(['/']);
  }

}
