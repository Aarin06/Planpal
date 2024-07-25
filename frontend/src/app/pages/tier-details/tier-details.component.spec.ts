import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierDetailsComponent } from './tier-details.component';

describe('TierDetailsComponent', () => {
  let component: TierDetailsComponent;
  let fixture: ComponentFixture<TierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TierDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
