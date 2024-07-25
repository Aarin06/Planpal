import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItineraryComponent } from './view-itinerary.component';

describe('ViewItineraryComponent', () => {
  let component: ViewItineraryComponent;
  let fixture: ComponentFixture<ViewItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewItineraryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
