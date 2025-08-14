import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffMenuComponent } from './StaffMenu.component';



describe('StaffMenuComponent', () => {
  let component: StaffMenuComponent;
  let fixture: ComponentFixture<StaffMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffMenuComponent]
    });
    fixture = TestBed.createComponent(StaffMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
