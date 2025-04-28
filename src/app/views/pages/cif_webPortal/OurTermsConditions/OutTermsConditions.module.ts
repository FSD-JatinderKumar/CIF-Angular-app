import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule,NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";
import { ReactiveFormsModule } from '@angular/forms';
import {  OurTermsConditionsComponent } from './OurTermsConditions.component';
import {} from './OurTermsConditions.component'
 




import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// Ng-select
import { NgSelectModule } from '@ng-select/ng-select';
import { CifMenuBarModule } from '../cif-menu-bar/cif-menu-bar.module';

const routes: Routes = [
  {
    path: '',
    component: OurTermsConditionsComponent
  }
]
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [OurTermsConditionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgbModule,
    ReactiveFormsModule,
    CifMenuBarModule
  ],
  providers: [
    NgbRatingConfig,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class OurTermsConditionsModule { }
// Added by Jatinder Kumar 31309






// const routes: Routes = [
//   {
//     path: '',
//     component: OurTermsConditionsComponent
//   }
// ]
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
// @NgModule({
//   declarations: [OurTermsConditionsComponent],
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes),
//     PerfectScrollbarModule,
//     NgbModule,
//     ReactiveFormsModule,
//     CifMenuBarModule,
//     CommonHeaderModule
//   ],
//   providers: [
//     NgbRatingConfig,
//     {
//       provide: PERFECT_SCROLLBAR_CONFIG,
//       useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
//     }
//   ]
// })
// export class OurTermsConditionsModule { }
// // Added by Jatinder Kumar 31309
