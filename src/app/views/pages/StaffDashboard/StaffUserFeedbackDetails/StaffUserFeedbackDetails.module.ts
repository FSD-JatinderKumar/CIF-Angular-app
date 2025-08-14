 
import { StaffUserFeedbackDetailsComponent } from './StaffUserFeedbackDetails.component';
 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { StaffMenuModule } from '../StaffMenu/StaffMenu.module'; 
const routes: Routes = [
  {
    path: '',
    component: StaffUserFeedbackDetailsComponent  
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
    StaffMenuModule // Include the menu bar module
  ],
  declarations: [StaffUserFeedbackDetailsComponent]
})
export class StaffUserFeedbackDetailsModule { }
