import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { BaseComponent } from './views/layout/base/base.component';
// import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { SearchBookingsComponent } from './views/pages/cif_webPortal/search-bookings/search-bookings.component';
import { CifInstrumentsComponent } from './views/pages/cif_webPortal/CifInstruments/CifInstruments.component';
import { CifRegisterPageComponent } from './views/pages/cif_webPortal/CifRegisterPage/CifRegisterPage.component';
// import { RefundStatusComponent } from './views/pages/cif_webPortal/refund-status/refund-status.component';
// import { ChangePasswordsComponent } from './views/pages/cif_webPortal/change-passwords/change-passwords.component';


const routes: Routes = [


  // Staff Dashboard for Upload results

  {
    path: "StaffLogins/:LoginName",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUserlogin/StaffUser-login.module').then(m => m.StaffUserLoginModule),
    // component:AdminPendingPaymentsComponent
  },
  {
    path: "StaffActionBookings",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffActionBookings/StaffActionBookings.module').then(m => m.StaffActionBookingsModule),
    // component:AdminPendingPaymentsComponent
  },
  {
    path: "PendingPaymentsS",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffPendingPayments/StaffPendingPayments.module').then(m => m.StaffPendingPaymentsModule),
    // component:AdminPendingPaymentsComponent
  },
  {
    path: "SampleStatusS",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUpdateSampleStatus/StaffUpdateSampleStatus.module').then(m => m.StaffUpdateSampleStatusModule),
    // component:AdminAssignTestComponent
  },
  {
    path: "UserFeedbackdetailsS",// Add Module file 
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUserFeedbackDetails/StaffUserFeedbackDetails.module').then(m => m.StaffUserFeedbackDetailsModule),
    // component:AdminUserDetailsComponent
  },
  {
    path: "UserDetailSS",// Add Module file 
    loadChildren: () => import('./views/pages/StaffDashboard/UserDetails/StaffUserDetails.module').then(m => m.StaffUserDetailsModule),
    // component:AdminUserDetailsComponent
  },
  {
    path: 'ourInstruments',
    // component: CifInstrumentsComponent,// done with module
    loadChildren: () => import('./views/pages/cif_webPortal/CifInstruments/CifInstruments.module').then(m => m.CifInstrumentsModule),
  },
  {
    path: 'ourInstruments/:Name/:id/:categoryId',    //  component: CifInstrumentsComponent , done with module
    loadChildren: () => import('./views/pages/cif_webPortal/CifInstruments/CifInstruments.module').then(m => m.CifInstrumentsModule),
  },
  {
    path: '',    // component:HomePageComponent done with module
    loadChildren: () => import('./views/pages/cif_webPortal/HomePage/HomePage.module').then(m => m.HomePageModule),
  },
  {
    path: 'Login',    // component: CifLoginPageComponent done with module
    loadChildren: () => import('./views/pages/cif_webPortal/CifLoginPage/CifLoginPage.component.module').then(m => m.CifLoginPageModule),
  },

  {
    path: "LpuLogin",// component:LoginPageNComponent done with module
    loadChildren: () => import('./views/pages/cif_webPortal/LoginPage/LoginPage.module').then(m => m.LoginPageNComponentModule),

  },
  {
    path: 'Register',//    component: CifRegisterPageComponent,   // done with module
    loadChildren: () => import('./views/pages/cif_webPortal/CifRegisterPage/CifRegisterPage.component.module').then(m => m.CifRegisterPageModule),
  },
  {
    path: 'recoverAccount',  // component:RecoverAccountComponent done with Module
    loadChildren: () => import('./views/pages/cif_webPortal/recover-account/recover-account.module').then(m => m.RecoverAccountModule),
  },
  {
    path: 'cifDashboards',
    //  component: CifUserDashboardComponent, done with Module
    loadChildren: () => import('./views/pages/cif_webPortal/cif-user-dashboard/cif-user-dashboard.module').then(m => m.CifUserDashboardModule),
  },
  {
    path: "NewBookings",
    //  component:NewBookingsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/new-bookings/new-bookings.module').then(m => m.NewBookingsModule),
  },

  {
    path: "ViewBookings",
    loadChildren: () => import('./views/pages/cif_webPortal/view-bookings/view-bookings.module').then(m => m.ViewBookingsModule),
  },

  {
    path: "SearchPendingPayments",
    //component:SearchPaymentsPendingComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/search-payments-pending/search-payments-pending.module').then(m => m.SearchPaymentsPendingModule),
  },

  {
    path: "FailedPayments",
    // component:FailedPaymentsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/FailedPayments/FailedPayments.module').then(m => m.FailedPaymentsModule),
  },

  {
    path: "BookingStatus",
    // component:BookingStatusComponent,    
    loadChildren: () => import('./views/pages/cif_webPortal/booking-status/booking-status.module').then(m => m.BookingStatusModule),
  },
  {
    path: "BookingResult",
    // component:BookingResultsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/booking-results/booking-results.module').then(m => m.BookingResultsModule),
  },



  {
    path: "SearchBookings", component: SearchBookingsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/search-bookings/search-bookings.module').then(m => m.SearchBookingsModule),
  },

  {
    path: "PendingPayments",
    // component:PendingPaymentsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/pending-payments/pending-payments.module').then(m => m.PendingPaymentsModule),
  },
  {
    path: "SearchPayments",
    // component:SearchPaymentsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/search-payments/search-payments.module').then(m => m.SearchPaymentsModule),
  },
  {
    path: "ResponsePayments",
    loadChildren: () => import('./views/pages/cif_webPortal/payment-response-page/payment-response-page.module').then(m => m.PaymentResponsePageModule),
  },
  {
    path: "FeedbackForm",
    loadChildren: () => import('./views/pages/cif_webPortal/UserFeedbackForm/UserFeedbackForm.module').then(m => m.UserFeedbackFormModule),
  },
  // {path:"Refunds",component:RefundStatusComponent},
  {
    path: "ChangePassword",
    // component:ChangePasswordsComponent,
    loadChildren: () => import('./views/pages/cif_webPortal/change-passwords/change-passwords.module').then(m => m.ChangePasswordsModule),
  },

  {
    path: "AdminLoginX",  
    loadChildren: () => import('./views/pages/cif_webPortal/internalUser-login/internalUser-login.module').then(m => m.InternalUserLoginModule),
    // component:InternalUserLoginComponent
  },
  {
    path: "ViewBookingsAdmins",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminActionBookings/AdminActionBookings.module').then(m => m.AdminActionBookingsModule),
    // component:AdminActionBookingsComponent
  },
  {
    path: "AdminInstrumentAction", 
    loadChildren: () => import('./views/pages/cif_webPortal/AdminActionInstruments/AdminActionInstruments.mdoule').then(m => m.AdminActionInstrumentsModule),
    // component:AdminActionInstrumentsComponent
  },
  {
    path: "AssignTestCifA",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminAssignTest/AdminAssignTest.module').then(m => m.AdminAssignTestModule),
    // component:AdminAssignTestComponent
  },
  {
    path: "AdminUploadImage",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminNewInstruments/AdminActionInstruments.mdoule').then(m => m.AdminNewInstrumentsModule),
    // component:AdminNewInstrumentsComponent
  },
  {
    path: "PendingPaymentsA",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminPendingPayments/AdminPendingPayments.module').then(m => m.AdminPendingPaymentsModule),
    // component:AdminPendingPaymentsComponent
  },
  {
    path: "SampleStatus",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminUpdateSampleStatus/AdminUpdateSampleStatus.module').then(m => m.AdminUpdateSampleStatusModule),
    // component:AdminAssignTestComponent
  },
  {
    path: "UserDetail",// Add Module file 
    loadChildren: () => import('./views/pages/cif_webPortal/AdminUserDetails/AdminUserDetails.module').then(m => m.AdminUserDetailsModule),
    // component:AdminUserDetailsComponent
  },
  {
    path: "UserFeedbackdetails",
    loadChildren: () => import('./views/pages/cif_webPortal/AdminUserFeedbackDetails/AdminUserFeedbackDetails.module').then(m => m.AdminUserFeedbackDetailsModule),
    // component:AdminNewInstrumentsComponent
  },
  {
    path: "cifUserProfile",
    loadChildren: () => import('./views/pages/cif_webPortal/Cifprofile/Cifprofile.module').then(m => m.CifprofileModule),
    // component: CifPorfileComponent
  },
 
  {
    path: "MyTestDataXXXXXXXXXXXX/:loginName",
    loadChildren: () => import('./views/pages/cif_webPortal/ViewBookingAdmin/ViewBookingAdmin.module').then(m => m.ViewBookingAdminModule),
    // component:ViewBookingAdminComponent
  },
  {
    path: "CifTermsConditions", //    component:CifTermsConditionsComponent
    loadChildren: () => import('./views/pages/cif_webPortal/OurTermsConditions/OutTermsConditions.module').then(m => m.OurTermsConditionsModule),
  },
  {
    path: "LpuTermsConditions",//    component:OurTermsConditionsComponent
    loadChildren: () => import('./views/pages/cif_webPortal/OurTermsConditions/OutTermsConditions.module').then(m => m.OurTermsConditionsModule),
  },
  {
    path: 'error',
    loadChildren: () => import('./views/pages/cif_webPortal/HomePage/HomePage.module').then(m => m.HomePageModule),
    // component: ErrorPageComponent,
    // data: {
    //   'type': 404,
    //   'title': 'Page Not Found',
    //   'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    // }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },



 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
