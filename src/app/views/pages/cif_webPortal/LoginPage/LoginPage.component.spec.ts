import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageNComponent } from './LoginPage.component';

describe('LoginPageNComponent', () => {
  let component: LoginPageNComponent;
  let fixture: ComponentFixture<LoginPageNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPageNComponent]
    });
    fixture = TestBed.createComponent(LoginPageNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
