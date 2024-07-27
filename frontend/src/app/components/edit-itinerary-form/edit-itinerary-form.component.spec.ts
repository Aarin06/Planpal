import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItineraryFormComponent } from './edit-itinerary-form.component';

describe('EditItineraryFormComponent', () => {
  let component: EditItineraryFormComponent;
  let fixture: ComponentFixture<EditItineraryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditItineraryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditItineraryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
