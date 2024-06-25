import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-itinerary-setup',
  templateUrl: './itinerary-setup.component.html',
  styleUrls: ['./itinerary-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItinerarySetupComponent implements OnInit {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
