import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPaymentsPendingComponent } from './search-payments-pending.component';

describe('SearchPaymentsPendingComponent', () => {
  let component: SearchPaymentsPendingComponent;
  let fixture: ComponentFixture<SearchPaymentsPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPaymentsPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPaymentsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
