import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminDashboardModule } from '../AdminDashboard/AdminDashboard.module'; 
import { AdminAssignTestComponent } from './AdminAssignTest.component';
const routes: Routes = [
  {
    path: '',
    component: AdminAssignTestComponent  
  }
];

@NgModule({
  declarations: [
    AdminAssignTestComponent  
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
    AdminDashboardModule // Include the menu bar module
  ]
})
export class AdminAssignTestModule {}




// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Routes, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
// import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule,NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// // Ng-ApexCharts
// import { NgApexchartsModule } from "ng-apexcharts";
// import { ReactiveFormsModule } from '@angular/forms';
// import { AdminAssignTestComponent } from './AdminAssignTest.component';
// import {} from './AdminAssignTest.component'
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// // Ng-select
// import { NgSelectModule } from '@ng-select/ng-select';
// import { AdminDashboardModule } from "../AdminDashboard/AdminDashboard.module";
// const routes: Routes = [
//   {
//     path: '',
//     component: AdminAssignTestComponent
//   }
// ]
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
// @NgModule({
//   declarations: [AdminAssignTestComponent],
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes),
//     FormsModule,
//     FeatherIconModule,
//     NgbDropdownModule,
//     NgbDatepickerModule,
//     NgApexchartsModule,
//     NgxDatatableModule,
//     NgbNavModule,
//     NgbCollapseModule,
//     PerfectScrollbarModule,
//     NgbModule,
//     ReactiveFormsModule,
//     NgSelectModule,
//     AdminDashboardModule
// ],
//   providers: [
//     NgbRatingConfig,
//     {
//       provide: PERFECT_SCROLLBAR_CONFIG,
//       useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
//     }
//   ]
// })
// export class AdminAssignTestModule { }
// Added by Jatinder Kumar 31309