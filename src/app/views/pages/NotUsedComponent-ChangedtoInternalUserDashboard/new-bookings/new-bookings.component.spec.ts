import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBookingsComponent } from './new-bookings.component';

describe('NewBookingsComponent', () => {
  let component: NewBookingsComponent;
  let fixture: ComponentFixture<NewBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBookingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
