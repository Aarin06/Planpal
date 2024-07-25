import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrorComponent } from './payment-error.component';

describe('PaymentErrorComponent', () => {
  let component: PaymentErrorComponent;
  let fixture: ComponentFixture<PaymentErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
