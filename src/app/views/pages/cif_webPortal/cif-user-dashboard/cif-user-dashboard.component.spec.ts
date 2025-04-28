import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifUserDashboardComponent } from './cif-user-dashboard.component';

describe('CifUserDashboardComponent', () => {
  let component: CifUserDashboardComponent;
  let fixture: ComponentFixture<CifUserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CifUserDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
