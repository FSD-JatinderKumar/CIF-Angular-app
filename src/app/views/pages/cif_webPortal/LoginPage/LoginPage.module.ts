import { LoginPageNComponent } from './LoginPage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';

const routes: Routes = [
  {
    path: '',
    component: LoginPageNComponent, 
  }
]
@NgModule({
  declarations: [LoginPageNComponent],
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
export class LoginPageNComponentModule { }
