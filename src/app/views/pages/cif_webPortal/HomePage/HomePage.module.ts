import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HomePageComponent } from './HomePage.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ArchwizardModule } from 'angular-archwizard';
// import { NgbCollapseModule, NgbModule, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbCarousel, NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageTopBarComponent } from './HomePageTopBar/HomePageTopBar.component';
import { HomePageTopBarModule } from "./HomePageTopBar/HomePageTopBar.module";

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent, 
  }
]
@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    FormsModule,
    ArchwizardModule, ReactiveFormsModule,
    PerfectScrollbarModule,
    NgbModule,
    NgbCarouselModule,
    HomePageTopBarModule
],
})
export class HomePageModule { }
