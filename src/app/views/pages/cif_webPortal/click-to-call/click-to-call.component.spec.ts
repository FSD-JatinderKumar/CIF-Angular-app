import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickToCallComponent } from './click-to-call.component';

describe('ClickToCallComponent', () => {
  let component: ClickToCallComponent;
  let fixture: ComponentFixture<ClickToCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickToCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickToCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
