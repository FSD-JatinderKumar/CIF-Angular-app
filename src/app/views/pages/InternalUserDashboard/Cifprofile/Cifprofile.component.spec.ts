import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CifPorfileComponent } from './Cifprofile.component';

describe('ProfileComponent', () => {
  let component: CifPorfileComponent;
  let fixture: ComponentFixture<CifPorfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CifPorfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CifPorfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
