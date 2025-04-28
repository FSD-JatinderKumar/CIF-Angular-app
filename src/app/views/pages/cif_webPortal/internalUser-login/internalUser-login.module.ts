import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternalUserLoginComponent } from './internalUser-login.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: InternalUserLoginComponent  
  }
];

@NgModule({
  declarations: [
    InternalUserLoginComponent  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),  
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
  ]
})
export class InternalUserLoginModule {}

// import { ArchwizardModule } from 'angular-archwizard';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Routes, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import {DatePipe} from '@angular/common';
// import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
// import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule,NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap'; // Added by Jatinder Kumar 31309
// // Ng-ApexCharts
// import { NgApexchartsModule } from "ng-apexcharts";
// import { ReactiveFormsModule } from '@angular/forms';
// import { InternalUserLoginComponent} from './internalUser-login.component';
// import {} from './internalUser-login.component'
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// // Ng-select
// import { NgSelectModule } from '@ng-select/ng-select';
// import { MaterialModule } from 'src/material.module';
// const routes: Routes = [
//   {
//     path: '',
//     component: InternalUserLoginComponent
//   }
// ]
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
// @NgModule({
//   declarations: [InternalUserLoginComponent],
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
//     CommonModule,
//     RouterModule.forChild(routes),
//     ArchwizardModule,ReactiveFormsModule,
//     MaterialModule

//   ],
//   providers: [
//     DatePipe,
//     NgbRatingConfig,
//     {
//       provide: PERFECT_SCROLLBAR_CONFIG,
//       useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
//     }
//   ]
// })
// export class InternalUserLoginModule { }
