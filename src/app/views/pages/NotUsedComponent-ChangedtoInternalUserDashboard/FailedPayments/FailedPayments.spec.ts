import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedPaymentsComponent } from './FailedPayments.component';

describe('FailedPaymentsComponent', () => {
  let component: FailedPaymentsComponent;
  let fixture: ComponentFixture<FailedPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
