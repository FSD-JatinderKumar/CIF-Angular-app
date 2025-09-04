import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionCifEvents } from './AdminActionCifEvents';

describe('AdminActionCifEvents', () => {
  let component: AdminActionCifEvents;
  let fixture: ComponentFixture<AdminActionCifEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionCifEvents ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionCifEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
