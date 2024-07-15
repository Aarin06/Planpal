import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPreviewFormComponent } from './event-preview-form.component';

describe('EventPreviewFormComponent', () => {
  let component: EventPreviewFormComponent;
  let fixture: ComponentFixture<EventPreviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventPreviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPreviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
