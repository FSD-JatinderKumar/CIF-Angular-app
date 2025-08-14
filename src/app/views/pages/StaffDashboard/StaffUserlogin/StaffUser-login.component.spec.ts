import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserLoginComponent } from './internalUser-login.component';

describe('InternalUserLoginComponent', () => {
  let component: InternalUserLoginComponent;
  let fixture: ComponentFixture<InternalUserLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalUserLoginComponent]
    });
    fixture = TestBed.createComponent(InternalUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
