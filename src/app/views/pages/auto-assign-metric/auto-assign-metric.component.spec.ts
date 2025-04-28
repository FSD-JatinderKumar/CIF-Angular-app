import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAssignMetricComponent } from './auto-assign-metric.component';

describe('AutoAssignMetricComponent', () => {
  let component: AutoAssignMetricComponent;
  let fixture: ComponentFixture<AutoAssignMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAssignMetricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoAssignMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
