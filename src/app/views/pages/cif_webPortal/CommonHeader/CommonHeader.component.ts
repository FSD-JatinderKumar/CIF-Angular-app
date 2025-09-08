import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';


import { DOCUMENT } from '@angular/common';
// import { ATopHeaderModule } from "../atop-header/atop-header.module";


@Component({
  selector: 'app-CommonHeader',
  templateUrl: './CommonHeader.component.html',
  styleUrls: ['./CommonHeader.component.scss'],
})
export class CommonHeaderComponent implements OnInit {
   
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) { }
    user_Email: any;     UserRole: any; UserId: any;   sessionData: any[] = [];
    Remarks: any;  dataSource: any;  ServerUrl: any;
    getSessionDetails() {
        this.sessionData = this.AuthSession.getSession();
        for (const session of this.sessionData) {
            this.user_Email = session[0]['userEmail']
        }
    }
    ngOnInit(): void {

    }
    goto(val: any) {
        this.router.navigateByUrl(val);
      }
      isNavbarCollapsed: boolean = true;
      toggleNavbar(): void {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
      }
}
