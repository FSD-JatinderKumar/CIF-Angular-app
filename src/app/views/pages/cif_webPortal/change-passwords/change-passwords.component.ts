import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { FormsModule } from '@angular/forms';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-change-passwords',
  templateUrl: './change-passwords.component.html',
  styleUrls: ['./change-passwords.component.scss']
})
export class ChangePasswordsComponent implements OnInit {

  changePasswordForm: FormGroup;
  UserRole: any;
  UserId: any;
  SecretKey: any;
  passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    if (this.changePasswordForm.valid) {
      // console.log('Form Submitted', this.changePasswordForm.value);
      const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
      const ProofNameText = this.changePasswordForm.get('ProofNameText')?.value;
     
      // console.log((ProofNameText + "==="+ atob(this.ProofNumber) + "==="+ currentPassword + "==="+ atob(this.SecretKey) + "==="+ newPassword + "==="+ confirmPassword) )
      if (ProofNameText === atob(this.ProofNumber) && currentPassword === atob(this.SecretKey) && newPassword === confirmPassword) {
        const formData = new FormData();
        formData.append('UserId', this.UserId);
        formData.append('Password', newPassword);
     
        this.CIFwebService.CIFUpdateUserDetails(formData).subscribe({
          next: (data: any) => {
            const result = data.item1[0]['msg'];
            if (result === 'Success') {
              swal.fire({
                title: 'Details Updated Successfully!',
                text: 'You will be logeed out ',
                icon: 'success'
              }).then(() => {
                this.router.navigateByUrl('cifWebPortal');
                // this.router.navigate(['/cifWebPortal']);
              });
            } else if (result === 'Failed') {
              swal.fire({
                title: 'Unable to Update Details Try Again Later ',
                icon: 'error'
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal.fire({
                title: 'Something Went Wrong, Try again later',
                icon: 'error'
              }).then(() => {
                window.location.reload();
              });
            }
      
          },
          error: (error: any) => {
            swal.fire({
              title: 'Error',
              text: 'Failed to Update.',
              icon: 'error'
            }).then(() => {
              window.location.reload();
            });
          },
          complete: () => {
          }
        });
      }
      else {
        Swal.fire({
          title: 'Invalid Details provided, Try Later!',
          icon: 'error'
        }).then(() => {
          window.location.reload();
        });
      }

      const elapsed = new Date().getTime() - startTime;
            const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

            setTimeout(() => {
              this.loadingIndicator = false;
            }, remainingDelay);


    } else {
      console.log('Form Invalid');
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;

  @ViewChild('table') table: ElementRef;

  ServerUrl: any;
  ProofName: any;
  ProofNumber: any;
  loadingIndicator = true;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) {

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(5)]],
      ProofNameText: ['', [Validators.required, Validators.minLength(5)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }
  user_Email: any;
  sessionData: any[] = [];
  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
    this.ServerUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    // console.log(JSON.stringify(retrievedCookies))
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.EmailId;
    this.ProofName = retrievedCookies.ProofName;
    this.ProofNumber = retrievedCookies.ProofNumber;
    this.SecretKey = retrievedCookies.PasswordText;

    if (this.UserRole == 400000) {
      swal.fire({
        title: 'Unauthorise Access ',
        icon: 'warning',
      });
      this.router.navigate(['/cifWebPortal']);
    }
this.loadingIndicator=false;
  }
}
