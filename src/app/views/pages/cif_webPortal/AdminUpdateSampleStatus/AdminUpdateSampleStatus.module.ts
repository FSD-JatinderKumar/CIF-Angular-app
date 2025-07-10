import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUpdateSampleStatusComponent } from './AdminUpdateSampleStatus.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminDashboardModule } from '../AdminDashboard/AdminDashboard.module'; 
const routes: Routes = [
  {
    path: '',
    component: AdminUpdateSampleStatusComponent  
  }
];
@NgModule({
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
  ],
  declarations: [AdminUpdateSampleStatusComponent]
})
export class AdminUpdateSampleStatusModule { }
