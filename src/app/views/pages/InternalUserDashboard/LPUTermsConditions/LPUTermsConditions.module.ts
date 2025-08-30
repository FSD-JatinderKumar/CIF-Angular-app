import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// Ng-ApexCharts
import { ReactiveFormsModule } from '@angular/forms';
import {  LPUTermsConditionsComponent } from './LPUTermsConditions.component';
import {} from './LPUTermsConditions.component'
 




import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// Ng-select
import { CifMenuBarModule } from '../cif-menu-bar/cif-menu-bar.module';
import { HomePageTopBarModule } from '../../cif_webPortal/HomePage/HomePageTopBar/HomePageTopBar.module';

const routes: Routes = [
  {
    path: '',
    component: LPUTermsConditionsComponent
  }
]
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [LPUTermsConditionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgbModule,
    ReactiveFormsModule,
    CifMenuBarModule,
    HomePageTopBarModule
  ],
  providers: [
    NgbRatingConfig,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class LPUTermsConditionsModule { }
// Added by Jatinder Kumar 31309