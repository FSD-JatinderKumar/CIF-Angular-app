import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewEventsDataComponent } from './AdminNewEventsData.component';

describe('AdminNewEventsDataComponent', () => {
  let component: AdminNewEventsDataComponent;
  let fixture: ComponentFixture<AdminNewEventsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNewEventsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewEventsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
