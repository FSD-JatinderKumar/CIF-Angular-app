import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPaymentsComponent } from './search-payments.component';

describe('SearchPaymentsComponent', () => {
  let component: SearchPaymentsComponent;
  let fixture: ComponentFixture<SearchPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
