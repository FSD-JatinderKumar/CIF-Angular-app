import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from "simple-datatables";
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { warn } from 'console';
import { FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cif-user-dashboard',
  templateUrl: './cif-user-dashboard.component.html',
  styleUrls: ['./cif-user-dashboard.component.scss']
})
export class CifUserDashboardComponent implements OnInit {
  UserSessionData: any;
  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) { }


  ngOnInit(): void {
    // this.UserSessionData = this.AuthSession.getSession();
    // const GetCookieData = this.cookieService.get('authData');
    // console.log(" User Details = " + JSON.stringify(GetCookieData))
    // const retrievedCookies = JSON.parse(GetCookieData);
    // this.UserRole = retrievedCookies[0].userRole.length > 0 ? retrievedCookies[0].userRole: 'Internal User';
    // this.user_Email = retrievedCookies[0].emailId;
    // this.supervisorName = retrievedCookies[0].supervisorName;
    // this.departmentName = retrievedCookies[0].departmentName;
    // this.candidateName = retrievedCookies[0].candidateName;
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);

    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.user_Email = retrievedCookies.EmailId;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;

  }

}
