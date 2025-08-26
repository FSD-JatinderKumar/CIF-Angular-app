import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUploadedResultsComponent } from './StaffUploadedResults.component';

describe('StaffUploadedResultsComponent', () => {
  let component: StaffUploadedResultsComponent;
  let fixture: ComponentFixture<StaffUploadedResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffUploadedResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffUploadedResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
