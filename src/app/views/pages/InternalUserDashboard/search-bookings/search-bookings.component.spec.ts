import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBookingsComponent } from './search-bookings.component';

describe('SearchBookingsComponent', () => {
  let component: SearchBookingsComponent;
  let fixture: ComponentFixture<SearchBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBookingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
