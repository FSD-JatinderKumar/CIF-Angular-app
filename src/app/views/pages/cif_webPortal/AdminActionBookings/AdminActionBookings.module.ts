import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminActionBookingsComponent } from './AdminActionBookings.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminDashboardModule } from '../AdminDashboard/AdminDashboard.module'; // Import the menu bar module

const routes: Routes = [
  {
    path: '',
    component: AdminActionBookingsComponent // Route to the new bookings component
  }
];

@NgModule({
  declarations: [
    AdminActionBookingsComponent // Declare the new bookings component
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
    AdminDashboardModule  
  ]
})
export class AdminActionBookingsModule {}