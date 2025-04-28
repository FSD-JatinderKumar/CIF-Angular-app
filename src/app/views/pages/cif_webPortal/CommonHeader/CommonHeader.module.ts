import { CommonHeaderComponent } from './CommonHeader.component';
import {} from './CommonHeader.component'


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


const routes: Routes = [
  {
    path: '',
    component: CommonHeaderComponent, 
  }
]

@NgModule({
  declarations: [CommonHeaderComponent],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),   
      
    ],
  exports:[CommonHeaderComponent]
  })
 
export class  CommonHeaderModule { }






// const routes: Routes = [
//   {
//     path: '',
//     component: CommonHeaderComponent, 
//   }
// ]

// @NgModule({
//     imports: [
//       CommonModule,
//       RouterModule.forChild(routes),   
  
//     ],
//     exports:[CommonHeaderComponent]
//   })
 
// export class  CommonHeaderModule { }