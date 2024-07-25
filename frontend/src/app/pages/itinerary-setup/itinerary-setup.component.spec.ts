import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerarySetupComponent } from './itinerary-setup.component';

describe('ItinerarySetupComponent', () => {
  let component: ItinerarySetupComponent;
  let fixture: ComponentFixture<ItinerarySetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItinerarySetupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItinerarySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
