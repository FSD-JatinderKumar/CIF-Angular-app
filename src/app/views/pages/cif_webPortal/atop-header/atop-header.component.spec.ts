import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATopHeaderComponent } from './atop-header.component';

describe('ATopHeaderComponent', () => {
  let component: ATopHeaderComponent;
  let fixture: ComponentFixture<ATopHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ATopHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ATopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
