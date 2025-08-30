import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordsComponent } from './change-passwords.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { CifMenuBarModule } from '../cif-menu-bar/cif-menu-bar.module'; 

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordsComponent  
  }
];

@NgModule({
  declarations: [
    ChangePasswordsComponent  
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
export class ChangePasswordsModule {}
 // Added by Jatinder Kumar 31309
