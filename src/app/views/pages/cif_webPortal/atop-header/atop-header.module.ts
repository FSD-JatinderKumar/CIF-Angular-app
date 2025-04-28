import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ATopHeaderComponent } from './atop-header.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ATopHeaderComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),   
  
    ],
  
  })
 
export class ATopHeaderModule{ }


 