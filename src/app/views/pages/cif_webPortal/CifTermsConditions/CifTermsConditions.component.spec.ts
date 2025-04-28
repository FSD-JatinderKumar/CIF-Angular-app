import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CifTermsConditionsComponent } from './CifTermsConditions.component';

describe('CifTermsConditions', () => {
  let component: CifTermsConditionsComponent;
  let fixture: ComponentFixture<CifTermsConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CifTermsConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CifTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
