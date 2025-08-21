import { CifInstrumentsPage } from './cifInstrumentspage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: CifInstrumentsPage,
  }
]
@NgModule({
  declarations: [
    CifInstrumentsPage // Declare your component here
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbNavModule,
    RouterModule.forChild(routes),
    // 
  ],
})
export class CifInstrumentspageModule { }
