import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './core/guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { httpInterceptorProviders } from './_helpers/http.interceptor';

import { MatDialogModule } from '@angular/material/dialog';
import { SucessDialogModule } from './dialog/sucess-dialog/sucess-dialog.module';
import { RegisterPageComponent } from './views/pages/cif_webPortal/register-page/register-page.component';
import { DashBoardComponent } from './views/pages/cif_webPortal/dash-board/dash-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RefundStatusComponent } from './views/pages/cif_webPortal/refund-status/refund-status.component';
import { ChangePasswordsComponent } from './views/pages/InternalUserDashboard/change-passwords/change-passwords.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CookieService } from 'ngx-cookie-service';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatButtonModule } from '@angular/material/button';
import { ATopHeaderModule } from './views/pages/cif_webPortal/atop-header/atop-header.module';
import { AFooterBarModule } from './views/pages/cif_webPortal/afooter-bar/afooter-bar.module';
import { CifInstrumentsModule } from './views/pages/cif_webPortal/CifInstruments/CifInstruments.module';
import { CifRegisterPageModule } from './views/pages/cif_webPortal/CifRegisterPage/CifRegisterPage.component.module';
import { ATopHeaderComponent } from './views/pages/cif_webPortal/atop-header/atop-header.component';
import { AFooterBarComponent } from './views/pages/cif_webPortal/afooter-bar/afooter-bar.component';
import { CifInstrumentsComponent } from './views/pages/cif_webPortal/CifInstruments/CifInstruments.component';
import { CifLoginPageComponent } from './views/pages/cif_webPortal/CifLoginPage/CifLoginPage.component';
import { CifLoginPageModule } from './views/pages/cif_webPortal/CifLoginPage/CifLoginPage.component.module';
import { HeaderComponent } from "./views/pages/cif_webPortal/header/header.component";
import { FooterComponent } from "./views/pages/cif_webPortal/footer/footer.component";
import { ClickToCallComponent } from './views/pages/cif_webPortal/click-to-call/click-to-call.component';
import { HomePageTopBarModule } from "./views/pages/cif_webPortal/HomePage/HomePageTopBar/HomePageTopBar.module";

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    RegisterPageComponent,
    DashBoardComponent,
    RefundStatusComponent,
    // ChangePasswordsComponent,
    ATopHeaderComponent,
    AFooterBarComponent,
    CifInstrumentsComponent,
    CifLoginPageComponent,
    HeaderComponent,
    FooterComponent,
    ClickToCallComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    SucessDialogModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ATopHeaderModule,
    AFooterBarModule,
    CifInstrumentsModule,
    CifRegisterPageModule,
    HomePageTopBarModule
],
  providers: [
    httpInterceptorProviders,
    AuthGuard,
    CookieService,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
