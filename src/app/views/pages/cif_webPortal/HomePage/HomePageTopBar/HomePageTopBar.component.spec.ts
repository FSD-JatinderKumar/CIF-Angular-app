import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageTopBarComponent } from './HomePageTopBar.component';

describe('HomePageTopBarComponent', () => {
  let component: HomePageTopBarComponent;
  let fixture: ComponentFixture<HomePageTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageTopBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
