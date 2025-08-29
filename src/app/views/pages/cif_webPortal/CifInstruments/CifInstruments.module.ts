import { CifInstrumentsComponent } from './CifInstruments.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/material.module';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

// import { NgbCollapseModule, NgbModule, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageTopBarModule } from '../HomePage/HomePageTopBar/HomePageTopBar.module';


const routes: Routes = [
  {
    path: '',
    component: CifInstrumentsComponent,
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbNavModule,
    HomePageTopBarModule
    // 
  ],
})
export class CifInstrumentsModule { }
