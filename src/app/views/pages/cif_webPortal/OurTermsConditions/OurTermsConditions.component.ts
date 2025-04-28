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
import { CifMenuBarComponent } from '../cif-menu-bar/cif-menu-bar.component';
// CifMenuBarComponent

@Component({
  selector: 'app-OurTermsConditions',
  templateUrl: './OurTermsConditions.component.html',
  styleUrls: ['./OurTermsConditions.component.scss']
})
export class OurTermsConditionsComponent implements OnInit {
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
    public formBuilder: UntypedFormBuilder,
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
