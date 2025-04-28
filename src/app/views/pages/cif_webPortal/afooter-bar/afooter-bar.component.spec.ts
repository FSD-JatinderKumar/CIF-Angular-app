import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AFooterBarComponent } from './afooter-bar.component';

describe('AFooterBarComponent', () => {
  let component: AFooterBarComponent;
  let fixture: ComponentFixture<AFooterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AFooterBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AFooterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
