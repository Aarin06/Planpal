import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEventFormComponent } from './custom-event-form.component';

describe('CustomEventFormComponent', () => {
  let component: CustomEventFormComponent;
  let fixture: ComponentFixture<CustomEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomEventFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
