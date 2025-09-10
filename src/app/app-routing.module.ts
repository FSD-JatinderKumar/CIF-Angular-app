import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { SearchBookingsComponent } from './views/pages/InternalUserDashboard/search-bookings/search-bookings.component';


const routes: Routes = [
// Normal or Common Pages

{
  path: 'ourInstruments',
  loadChildren: () => import('./views/pages/cif_webPortal/CifInstruments/CifInstruments.module').then(m => m.CifInstrumentsModule),
},
{
  path: 'ourInstruments/:Name/:id/:categoryId',    
  loadChildren: () => import('./views/pages/cif_webPortal/CifInstruments/CifInstruments.module').then(m => m.CifInstrumentsModule),
},
{
  path: '',    
  loadChildren: () => import('./views/pages/cif_webPortal/HomePage/HomePage.module').then(m => m.HomePageModule),
},
{
  path:'Home',  
  loadChildren: () => import('./views/pages/cif_webPortal/HomePage/HomePage.module').then(m => m.HomePageModule),
},
{
  path: 'Login',    
  loadChildren: () => import('./views/pages/cif_webPortal/CifLoginPage/CifLoginPage.component.module').then(m => m.CifLoginPageModule),
},

{
  path: 'Register', 
  loadChildren: () => import('./views/pages/cif_webPortal/CifRegisterPage/CifRegisterPage.component.module').then(m => m.CifRegisterPageModule),
},
{
  path: 'recoverAccount',  
  loadChildren: () => import('./views/pages/cif_webPortal/recover-account/recover-account.module').then(m => m.RecoverAccountModule),
},

// Ended Common Pages

// INTERNAL USER DASHBOARD START

{
  path:"UserProfiles",
  loadChildren: () => import('./views/pages/InternalUserDashboard/UserProfile/UserProfile.module').then(m => m.UserProfileModule),
},
{
  path: "LpuLogin", 
  loadChildren: () => import('./views/pages/InternalUserDashboard/LoginPage/LoginPage.module').then(m => m.LoginPageNComponentModule),
},
{
  path: "CifTermsConditions", 
  loadChildren: () => import('./views/pages/InternalUserDashboard/OurTermsConditions/OutTermsConditions.module').then(m => m.OurTermsConditionsModule),
},
{
  path: "NewBookings",
  loadChildren: () => import('./views/pages/InternalUserDashboard/new-bookings/new-bookings.module').then(m => m.NewBookingsModule),
},
{
  path: "ViewBookings",
  loadChildren: () => import('./views/pages/InternalUserDashboard/view-bookings/view-bookings.module').then(m => m.ViewBookingsModule),
},

{
  path: "SearchPayments",
  loadChildren: () => import('./views/pages/InternalUserDashboard/search-payments/search-payments.module').then(m => m.SearchPaymentsModule),
},
{
  path: "SearchPendingPayments",
  loadChildren: () => import('./views/pages/InternalUserDashboard/search-payments-pending/search-payments-pending.module').then(m => m.SearchPaymentsPendingModule),
},
{
  path: "FailedPayments",
  loadChildren: () => import('./views/pages/InternalUserDashboard/FailedPayments/FailedPayments.module').then(m => m.FailedPaymentsModule),
},
{
  path: "BookingStatus",
  loadChildren: () => import('./views/pages/InternalUserDashboard/booking-status/booking-status.module').then(m => m.BookingStatusModule),
},
{
  path: "BookingResult",
  loadChildren: () => import('./views/pages/InternalUserDashboard/booking-results/booking-results.module').then(m => m.BookingResultsModule),
},
{
  path: "FeedbackForm",
  loadChildren: () => import('./views/pages/InternalUserDashboard/UserFeedbackForm/UserFeedbackForm.module').then(m => m.UserFeedbackFormModule),
},
{
  path: "LpuTermsConditions",//    component:OurTermsConditionsComponent
  loadChildren: () => import('./views/pages/InternalUserDashboard/OurTermsConditions/OutTermsConditions.module').then(m => m.OurTermsConditionsModule),
},
{
  path: "SampleStatus",//    component:OurTermsConditionsComponent
  loadChildren: () => import('./views/pages/InternalUserDashboard/Sample-Status/SampleStatus.module').then(m => m.SampleStatusModule),
},
// INTERNAL USER DASHBOARD END


  // Staff Dashboard for Upload results

  {
    path: "StaffLogins",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUserlogin/StaffUser-login.module').then(m => m.StaffUserLoginModule),
  },
  {
    path: "StaffActionBookings",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffActionBookings/StaffActionBookings.module').then(m => m.StaffActionBookingsModule),
  },
  {
    path: "MyUploads",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUploadedResults/StaffUploadedResults.module').then(m => m.StaffUploadedResultsModule),
  },
  {
    path: "PendingPaymentsS",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffPendingPayments/StaffPendingPayments.module').then(m => m.StaffPendingPaymentsModule),
  },
  {
    path: "SampleStatusS",
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUpdateSampleStatus/StaffUpdateSampleStatus.module').then(m => m.StaffUpdateSampleStatusModule),
  },
  {
    path: "UserFeedbackdetailsS",// Add Module file 
    loadChildren: () => import('./views/pages/StaffDashboard/StaffUserFeedbackDetails/StaffUserFeedbackDetails.module').then(m => m.StaffUserFeedbackDetailsModule),
  },
  {
    path: "UserDetailSS",// Add Module file 
    loadChildren: () => import('./views/pages/StaffDashboard/UserDetails/StaffUserDetails.module').then(m => m.StaffUserDetailsModule),
  },
 
  
  {
    path: "SearchBookings", component: SearchBookingsComponent,
    loadChildren: () => import('./views/pages/InternalUserDashboard/search-bookings/search-bookings.module').then(m => m.SearchBookingsModule),
  },

  {
    path: "PendingPayments",
    loadChildren: () => import('./views/pages/InternalUserDashboard/pending-payments/pending-payments.module').then(m=>m.PendingPaymentsModule),
  },

  {
    path: "ResponsePayments",
    loadChildren: () => import('./views/pages/InternalUserDashboard/payment-response-page/payment-response-page.module').then(m => m.PaymentResponsePageModule),
  },
 
  // {path:"Refunds",component:RefundStatusComponent},
  {
    path: "ChangePassword",
    loadChildren: () => import('./views/pages/InternalUserDashboard/change-passwords/change-passwords.module').then(m => m.ChangePasswordsModule),
  },
// ENDED STAFF DASHBOARD

  {
    path: 'cifDashboards',
    loadChildren: () => import('./views/pages/cif_webPortal/cif-user-dashboard/cif-user-dashboard.module').then(m => m.CifUserDashboardModule),
  },

// Admin Dashboard

{
  path: "EventUploads",
  loadChildren: () => import('./views/pages/AdminDashboard/AdminNewEventsData/AdminNewEventsData.module').then(m => m.AdminNewEventsDataModule),
},
{
  path: "AllCIFEvents",
  loadChildren: () => import('./views/pages/AdminDashboard/AdminActionCifEvents/AdminActionCifEvents.mdoule').then(m => m.AdminActionInstrumentsModule),
},
  {
    path: "AdminLoginX",  
    loadChildren: () => import('./views/pages/cif_webPortal/internalUser-login/internalUser-login.module').then(m => m.InternalUserLoginModule),
    // component:InternalUserLoginComponent
  },
  {
    path: "ViewBookingsAdmins",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminActionBookings/AdminActionBookings.module').then(m => m.AdminActionBookingsModule),
    // component:AdminActionBookingsComponent
  },
  {
    path: "AdminInstrumentAction", 
    loadChildren: () => import('./views/pages/AdminDashboard/AdminActionInstruments/AdminActionInstruments.mdoule').then(m => m.AdminActionInstrumentsModule),
    // component:AdminActionInstrumentsComponent
  },
  {
    path: "AssignTestCifA",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminAssignTest/AdminAssignTest.module').then(m => m.AdminAssignTestModule),
    // component:AdminAssignTestComponent
  },
  {
    path: "AdminUploadImage",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminNewInstruments/AdminActionInstruments.mdoule').then(m => m.AdminNewInstrumentsModule),
    // component:AdminNewInstrumentsComponent
  },
  {
    path: "PendingPaymentsA",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminPendingPayments/AdminPendingPayments.module').then(m => m.AdminPendingPaymentsModule),
    // component:AdminPendingPaymentsComponent
  },
  {
    path: "SampleStatusAdmin",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminUpdateSampleStatus/AdminUpdateSampleStatus.module').then(m => m.AdminUpdateSampleStatusModule),
    // component:AdminAssignTestComponent
  },
  {
    path: "UserDetail",// Add Module file 
    loadChildren: () => import('./views/pages/AdminDashboard/AdminUserDetails/AdminUserDetails.module').then(m => m.AdminUserDetailsModule),
    // component:AdminUserDetailsComponent
  },
  {
    path: "UserFeedbackdetails",
    loadChildren: () => import('./views/pages/AdminDashboard/AdminUserFeedbackDetails/AdminUserFeedbackDetails.module').then(m => m.AdminUserFeedbackDetailsModule),
    // component:AdminNewInstrumentsComponent
  },
  {
    path: "cifUserProfile",
    loadChildren: () => import('./views/pages/InternalUserDashboard/Cifprofile/Cifprofile.module').then(m => m.CifprofileModule),
    // component: CifPorfileComponent
  },
 
  {
    path: "MyTestDataXXXXXXXXXXXX/:loginName",
    loadChildren: () => import('./views/pages/AdminDashboard/ViewBookingAdmin/ViewBookingAdmin.module').then(m => m.ViewBookingAdminModule),
    // component:ViewBookingAdminComponent
  },
 
  {
    path: "LPUTermsCondition", //    component:CifTermsConditionsComponent
    loadChildren: () => import('./views/pages/InternalUserDashboard/LPUTermsConditions/LPUTermsConditions.module').then(m => m.LPUTermsConditionsModule),
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
