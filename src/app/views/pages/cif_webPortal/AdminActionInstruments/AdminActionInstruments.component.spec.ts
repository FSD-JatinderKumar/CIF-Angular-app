import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionInstrumentsComponent } from './AdminActionInstruments.component';

describe('AdminActionInstrumentsComponent', () => {
  let component: AdminActionInstrumentsComponent;
  let fixture: ComponentFixture<AdminActionInstrumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionInstrumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionInstrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
