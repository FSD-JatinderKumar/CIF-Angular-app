import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewInstrumentsComponent } from './AdminNewInstruments.component';

describe('AdminNewInstrumentsComponent', () => {
  let component: AdminNewInstrumentsComponent;
  let fixture: ComponentFixture<AdminNewInstrumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNewInstrumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewInstrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
