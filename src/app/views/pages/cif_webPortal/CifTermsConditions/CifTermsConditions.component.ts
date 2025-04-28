import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
 

@Component({
  selector: 'app-CifTermsConditions',
  templateUrl: './CifTermsConditions.component.html',
  styleUrls: ['./CifTermsConditions.component.scss']
})
export class CifTermsConditionsComponent implements OnInit {
  UserRole: any;
  UserId: any;
  user_Email: any;
  CanidateName: any;
  Department: any;
  Designation: any;
  MobileN: any;
  SupervisorName: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.CanidateName = retrievedCookies.CandidateName;
    this.UserId = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.Department = retrievedCookies.DepartmentName;
    this.Designation=retrievedCookies.Designation;
    this.MobileN=retrievedCookies.MobileNo;
    this.UserRole=retrievedCookies.UserRole;
    this.SupervisorName=retrievedCookies.SupervisorName;
  }

}
