import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule,NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";
import { ReactiveFormsModule } from '@angular/forms';
import { AutoAssignMetricComponent } from './auto-assign-metric.component';
import {} from './auto-assign-metric.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// Ng-select
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { ArchwizardModule } from 'angular-archwizard';
const routes: Routes = [
  {
    path: '',
    component: AutoAssignMetricComponent
  }
]
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [AutoAssignMetricComponent],
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
    FormsModule,
    ReactiveFormsModule,    
    RouterModule.forChild(routes),
    FeatherIconModule,
    QuillModule.forRoot(),
    ArchwizardModule

  ],
  providers: [
    NgbRatingConfig,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AutoAssignMetricModule { }


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
// import { NgbCarousel, NgbModule } from '@ng-bootstrap/ng-bootstrap';


// @NgModule({
//   imports: [BrowserModule, NgbModule],
//   providers: [],
//   // bootstrap: [],
// })
// // @NgModule({
// //   declarations: [],
// //   imports: [
// //     CommonModule,
// //     BrowserModule,
    
// //   ]
// // })
// export class AutoAssignMetricModule { }
