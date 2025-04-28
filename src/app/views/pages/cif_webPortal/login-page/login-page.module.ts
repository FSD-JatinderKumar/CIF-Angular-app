import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Third-party modules
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

// Core modules
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';

// Component
import { LoginPageComponent } from './login-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  }
]

const DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
  suppressScrollX: true
};

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbCollapseModule,
    NgApexchartsModule,
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class LoginPageModule { }
