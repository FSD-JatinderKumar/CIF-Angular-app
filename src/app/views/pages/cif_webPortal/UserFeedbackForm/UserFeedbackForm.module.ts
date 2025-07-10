// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UserFeedbackFormComponent } from './UserFeedbackForm.component';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [UserFeedbackFormComponent]
// })
// export class UserFeedbackFormModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { CifMenuBarModule } from '../cif-menu-bar/cif-menu-bar.module'; // Import the menu bar module
import { UserFeedbackFormComponent } from './UserFeedbackForm.component';
const routes: Routes = [
  {
    path: '',
    component: UserFeedbackFormComponent // Route to the new bookings component
  }
];

@NgModule({
  declarations: [
    UserFeedbackFormComponent // Declare the new bookings component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Set up child routes
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModule,
    PerfectScrollbarModule,
    NgSelectModule,
    CifMenuBarModule // Include the menu bar module
  ]
})
export class UserFeedbackFormModule { }