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
  standalone: false,
  selector: 'app-cif-menu-bar',
  templateUrl: './cif-menu-bar.component.html',
  styleUrls: ['./cif-menu-bar.component.scss']
})
export class CifMenuBarComponent implements OnInit {

  UserSessionData: any;   UserRole: any;    user_Email: any;  supervisorName: any;  departmentName: any;  candidateName: any;
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData.length == 0) {
      swal.fire({
        title: 'Login Failed ',
        icon: 'warning',
      });
      this.router.navigate(['']);
    }
   }
//    openSampleInstructions() {
//      swal.fire({
//        title: 'Sample Submission Instructions',
//        html: `<p>Send samples to:</p>
//             <address>
//               LOVELY PROFESSIONAL UNIVERSITY
// Block-38, Room No.106
// Jalandhar - Delhi G.T. Road, Phagwara, Punjab (India) - 144411,
// Telephone no: 01824-444021
// Email-id: cif@lpu.co.in
//             </address>`,
//        icon: 'info'
//      });
openSampleInstructions() {
  swal.fire({
    title: 'Send Samples at the following Address :',
    html: `
         <address>
          <div class="contact-text">
           Central Instrumentation Facility (CIF) <br/>
          Lovely Professional University <br/>
          Block-38, Room No.106 <br/>
          Jalandhar - Delhi G.T. Road, <br/>
          Phagwara, Punjab (India) - 144411 <br/>
          Phone : <a href="tel:+911824444021">+91 1824-444021</a><br>
          Email : cif@lpu.co.in<br>
          </div>
         </address>`,
    icon: 'info'
  });

    // Option 2: Navigate to a page
    // this.router.navigate(['/sample-instructions']);
  }
  showBlink = true;
  
  // openSampleInstructions() {
  //   // Open modal or navigate
  //   this.router.navigate(['/sample-instructions']);
  // }
  ngOnInit(): void {

    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);

    this.UserRole = retrievedCookies.UserRole ;//?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.user_Email = retrievedCookies.EmailId;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;


  }
  handleChangePassword(event: Event) {
    if (this.CheckUser()) {
      event.preventDefault(); // Prevent link navigation
    } else {
      this.router.navigate(['/ChangePassword']);
    }
  }

  CheckUser(): boolean {
    return this.UserRole==400000 ? true : false;  
  }

  goto(val: any) {
    this.router.navigateByUrl(val);
  }
  isNavbarCollapsed: boolean = true;
  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
