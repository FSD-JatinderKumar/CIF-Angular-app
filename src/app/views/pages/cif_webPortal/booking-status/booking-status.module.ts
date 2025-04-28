import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingStatusComponent } from './booking-status.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { CifMenuBarModule } from '../cif-menu-bar/cif-menu-bar.module'; 

const routes: Routes = [
  {
    path: '',
    component: BookingStatusComponent  
  }
];

@NgModule({
  declarations: [
    BookingStatusComponent  
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
    CifMenuBarModule  
  ]
})
export class BookingStatusModule {}