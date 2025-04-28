import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule,NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// Ng-select
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminDashboardModule } from "../AdminDashboard/AdminDashboard.module";
import { ViewBookingAdminComponent } from './ViewBookingAdmin.component';
import { FacultyDashboardModule } from '../FacultyDashboard/FacultyDashboard.module';
const routes: Routes = [
  {
    path: '',
    component: ViewBookingAdminComponent
  }
]
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [ViewBookingAdminComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgxDatatableModule,
    NgbNavModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    AdminDashboardModule,
    FacultyDashboardModule
],
  providers: [
    NgbRatingConfig,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ViewBookingAdminModule { }
// Added by Jatinder Kumar 31309







// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ViewBookingAdminComponent } from './ViewBookingAdmin.component';
// import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { AdminDashboardModule } from '../AdminDashboard/AdminDashboard.module'; // Import the menu bar module

// const routes: Routes = [
//   {
//     path: '',
//     component: ViewBookingAdminComponent // Route to the new bookings component
//   }
// ];

// @NgModule({
 
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes), // Set up child routes
//     FormsModule,
//     ReactiveFormsModule,
//     NgbNavModule,
//     NgbModule,
//     PerfectScrollbarModule,
//     NgSelectModule,
//     AdminDashboardModule  
//   ]
// })
// export class ViewBookingAdminModule {}