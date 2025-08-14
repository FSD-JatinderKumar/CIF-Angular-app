import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffActionBookingsComponent } from './StaffActionBookings.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { StaffMenuModule } from "../StaffMenu/StaffMenu.module";

const routes: Routes = [
  {
    path: '',
    component: StaffActionBookingsComponent // Route to the new bookings component
  }
];

@NgModule({
  declarations: [
    StaffActionBookingsComponent // Declare the new bookings component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Set up child routes
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
   StaffMenuModule
  ]
})
export class StaffActionBookingsModule {}