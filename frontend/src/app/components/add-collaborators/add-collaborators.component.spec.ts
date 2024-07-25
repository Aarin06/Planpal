import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollaboratorsComponent } from './add-collaborators.component';

describe('AddCollaboratorsComponent', () => {
  let component: AddCollaboratorsComponent;
  let fixture: ComponentFixture<AddCollaboratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCollaboratorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
