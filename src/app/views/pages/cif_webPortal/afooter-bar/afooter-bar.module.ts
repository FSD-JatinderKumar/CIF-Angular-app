import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AFooterBarComponent } from './afooter-bar.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AFooterBarComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),   
  
    ],
  
  })
 
export class AFooterBarModule{ }

 