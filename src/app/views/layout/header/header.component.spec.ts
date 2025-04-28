import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysioHeaderComponent } from './header.component';

describe('PhysioHeaderComponent', () => {
  let component: PhysioHeaderComponent;
  let fixture: ComponentFixture<PhysioHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysioHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysioHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
