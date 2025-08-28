import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CifRegisterPageComponent } from './CifRegisterPage.component';
import {} from './CifRegisterPage.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ArchwizardModule } from 'angular-archwizard';
 
const routes: Routes = [
  {
    path: '',
    component: CifRegisterPageComponent, 
  }
]
@NgModule({
  declarations: [CifRegisterPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    FormsModule,
    ArchwizardModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    NgbModule
  ],
})
 
export class CifRegisterPageModule { }
