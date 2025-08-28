import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CifLoginPageComponent } from './CifLoginPage.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: CifLoginPageComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,   
      FormsModule,
      NgxDatatableModule,
      ReactiveFormsModule,
      PerfectScrollbarModule,
      NgbModule
    ],
  
  })
 
export class CifLoginPageModule { }
