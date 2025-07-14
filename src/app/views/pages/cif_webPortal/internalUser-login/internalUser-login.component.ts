import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

@Component({
  selector: 'app-internalUser-login',
  templateUrl: './internalUser-login.component.html',
  styleUrls: ['./internalUser-login.component.scss']
})
export class InternalUserLoginComponent implements OnInit {
  formdata!: FormGroup;
  submitted = false;
  showPassword = false;
  loginError: string | null = null;
  isLoginFailed = false;
  showNoDataFoundMessage = false;
  loadingIndicator = false;
  storeResult = 0;

  // User info
  CandidateName: any;
  UserId: any;
  Department: any;
  DepartmentName: any;
  Designation: any;
  EmailId: any;
  MobileNo: any;
  UserRole: any;
  SupervisorName: any;
  SecretKey: any;
  EmployeeDetails: any;
  EmployeeName: any;
  EmployeeCode: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private CIFwebService: LpuCIFWebService,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mouDocumentsService: MouDocumentsService,
  ) { }

  ngOnInit(): void {
    this.AuthSession.clearSession(); // Keep session clear on entry, not cookie
    this.loadForm();
  }

  loadForm(): void {
    this.formdata = this.fb.group({
      Email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.submitted = false;
    this.loginError = null;
  }

  get email(): AbstractControl | null {
    return this.formdata.get('Email');
  }

  get passwordText(): AbstractControl | null {
    return this.formdata.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  OnSubmit(): void {
    if (this.formdata.invalid) return;

    const { Email, password } = this.formdata.value;
    const encodedEmail = btoa(Email ?? '');
    const encodedPassword = btoa(password ?? '');
    this.SecretKey = password ?? '';

    this.getToken(encodedEmail, encodedPassword);
  }

  getToken(encodedEmail: string, encodedPassword: string): void {
    this.authService.loginInternalUser(atob(encodedEmail), atob(encodedPassword)).subscribe({
      next: data => {
        this.storageService.saveUser(data.token);
        this.GetEmployeeDetails();
      },
      error: err => {
        this.handleLoginFailure(err);
      }
    });
  }

  GetEmployeeDetails(): void {
    this.mouDocumentsService.GetEmployeeDetails().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.EmployeeDetails = response.item1;
          const emp = response.item1[0];

          this.CandidateName = this.EmployeeName = emp.employeeName;
          this.UserId = this.EmployeeCode = emp.employeeCode;
          this.Department = emp.department;
          this.DepartmentName = emp.departmentName;
          this.Designation = emp.department;
          this.EmailId = emp.email;
          this.MobileNo = emp.contactNo;
          this.UserRole = 'Admin-User';
          this.SupervisorName = emp.department;
          this.loadingIndicator = false;
          this.showNoDataFoundMessage = false;
          this.isLoginFailed = false;

          const userCookiesData = {
            CandidateName: this.CandidateName,
            UserId: this.UserId,
            Department: this.Department,
            DepartmentName: this.DepartmentName,
            Designation: this.Designation,
            EmailId: this.EmailId,
            MobileNo: this.MobileNo,
            UserRole: this.UserRole,
            SupervisorName: this.SupervisorName,
            ProofNumber: this.MobileNo,
            ProofName: 'Mobile',
            PasswordText: this.SecretKey,
          };

          this.cookieService.set(
            'authData',
            JSON.stringify(userCookiesData),
            1,              // Expiration in days
            '/',            // Path
            undefined,      // Domain
            true,           // Secure: should be true in production
            'Lax'           // SameSite policy
          );

          this.AuthSession.addToSession(this.EmployeeDetails);

          // this.StoreInternalUserInDataBase();

          this.router.navigate(['/AssignTestCifA']);
        } else {
          this.EmployeeDetails = [];
          this.showNoDataFoundMessage = true;
          this.isLoginFailed = true;
        }
      },
      error: err => {
        this.handleLoginFailure(err);
      }
    });

    this.formdata.reset();
  }

  handleLoginFailure(error: any): void {
    this.cookieService.delete('authData');
    this.AuthSession.clearSession();
    this.isLoginFailed = true;
    console.error('Login failed:', error);

    swal.fire({
      title: 'Login Failed',
      text: 'Login details are invalid. Please try again.',
      icon: 'warning',
    });
  }

  StoreInternalUserInDataBase(): void {
    const formData = new FormData();
    formData.append("UserEmail", this.EmailId);
    formData.append("CandidateName", this.CandidateName);
    formData.append("SupervisorName", this.SupervisorName);
    formData.append("MobileNumber", this.MobileNo);
    formData.append("SchoolName", this.Department);
    formData.append("DepartmentName", this.DepartmentName);
    formData.append("IdProofType", 'UMS ID');
    formData.append("IdProofNumber", this.UserId);
    formData.append("UserType", this.UserRole);
    formData.append("Address", 'Internal User');
    formData.append("PasswordText", btoa(this.SecretKey));

    this.CIFwebService.NewUserRecord(formData).subscribe({
      next: (data) => {
        const result = data.item1[0]['msg'];
        const errorCode = data.item1[0]['returnId'];

        if (result === 'Success') {
          this.storeResult = 1;
        } else if (errorCode === -1) {
          this.storeResult = 0;
        } else {
          this.storeResult = -1;
        }
      },
      error: (err) => {
        console.error('Error saving user:', err);
        this.storeResult = -1;
      }
    });
  }
}

// import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { FormBuilder } from '@angular/forms';

// import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { DataTable } from "simple-datatables";
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import * as XLSX from 'xlsx';
// import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
// import swal from 'sweetalert2';
// import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
// import Swal from 'sweetalert2';
// import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { CookieService } from 'ngx-cookie-service';
// import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

// @Component({
//   selector: 'app-internalUser-login',
//   templateUrl: './internalUser-login.component.html',
//   styleUrls: ['./internalUser-login.component.scss']
// })
// export class InternalUserLoginComponent implements OnInit {
//   registrationNumber: any;
//   regdId: any;
//   DriveDropDown: any;
//   showNoDataFoundMessage: boolean;
//   UserData: any;
//   isLoginFailed: boolean;
//   EmployeeDetails: any;
//   EmployeeName: any;
//   EmployeeCode: any;
//   Department: any;
//   DepartmentName: any;
//   loadingIndicator: boolean;
//   CandidateName: any;
//   UserId: any;
//   Designation: any;
//   EmailId: any;
//   MobileNo: any;
//   UserRole: any;
//   SupervisorName: any;
//   SecretKey: any; 
//   storeResult: number;
//   constructor(
//     private CIFwebService: LpuCIFWebService,
//     private storageService: StorageService,
//     private authService: AuthService,
//     public formBuilder: UntypedFormBuilder,
//     private fb: FormBuilder,
//     private AuthSession: LoginSessionService,
//     private router: Router, private route: ActivatedRoute,
//     private cookieService: CookieService,
//     private mouDocumentsService: MouDocumentsService,
//   ) { }
//   ngOnInit(): void {
//     this.cookieService.delete('authData');
//     this.AuthSession.clearSession();
//     this.loadForm();
//   }
  
//   formdata!: FormGroup;
//   submitted = false;
//   showPassword = false;
//   loginError: string | null = null;
  
//    loadForm(): void {
//     this.formdata = this.fb.group({
//       Email: ['', [Validators.required, Validators.minLength(5)]],
//       password: ['', [Validators.required, Validators.minLength(5)]],
//     });
//     this.submitted = false;
//     this.loginError = null;
//   }

//   get email(): AbstractControl | null {
//     return this.formdata.get('Email');
//   }

//   get passwordText(): AbstractControl | null {
//     return this.formdata.get('password');
//   }

//   get userRole(): AbstractControl | null {
//     return this.formdata.get('UserRoleS');
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }
//   OnSubmit() {
//     var DataX = this.formdata.value;
//     var uid = DataX.Email ?? '';
//     var password = DataX.password ?? '';
//     var encodeduid = btoa(uid);
//     var encodedPassword = btoa(password);
//     var userRoleX: number | null = null;
//     this.getToken(encodeduid, encodedPassword);

// }


//   getToken(id: any, key: any) {
//     this.cookieService.delete('authData');
//     this.AuthSession.clearSession();
//     this.authService.loginInternalUser(atob(id), atob(key)).subscribe({
//       next: data => {
//         this.storageService.saveUser(data.token);
//         this.GetEmployeeDetails();
//       },
//       error: _err => {
//         this.LoginFailed(_err);
//       }
//     });
//   }
//   LoginFailed(_NewError: any) {
//     this.isLoginFailed = true;
//     swal.fire({
//       title: 'Login Failed',
//       text: 'Login details are Invalid!',
//       icon: 'warning',
//     })
//   }
//   GetEmployeeDetails() {
//       this.mouDocumentsService.GetEmployeeDetails().subscribe({
//         next: response => {
//           if (response.item1.length > 0) {
//             this.EmployeeDetails = response.item1;
//             this.CandidateName = this.EmployeeName = response.item1[0].employeeName;
//             this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
//             this.Department = response.item1[0].department;
//             this.DepartmentName = response.item1[0].departmentName;
//             this.Designation = response.item1[0].department;
//             this.EmailId = response.item1[0].email;
//             this.MobileNo = response.item1[0].contactNo;
//             this.UserRole = 'Admin-User'; 
//             this.SupervisorName = response.item1[0].department; 
//             this.loadingIndicator = false;
//             this.showNoDataFoundMessage = false;
//             this.isLoginFailed = false;
//             var DataX = this.formdata.value;
//             this.SecretKey = DataX.password ?? '';
//             const userCookiesData = {
//               CandidateName: this.CandidateName,
//               UserId: this.UserId,
//               Department: this.Department,
//               DepartmentName: this.DepartmentName,
//               Designation: this.Designation,
//               EmailId: this.EmailId,
//               MobileNo: this.MobileNo,
//               UserRole: this.UserRole,
//               SupervisorName: this.SupervisorName,
//               ProofNumber:this.MobileNo,
//               ProofName: 'Mobile ',
//               PasswordText: this.SecretKey,
//             };

         
//             this.cookieService.set('authData', JSON.stringify(userCookiesData), { expires: 7 });

         
//           this.AuthSession.addToSession(this.EmployeeDetails);
//           // this.StoreInternalUserInDataBase();
//           this.router.navigate(['/AssignTestCifA']);
//           } else {
//             this.EmployeeDetails = [];
//             this.showNoDataFoundMessage = true;
//             this.isLoginFailed = true;
//           }
//         },
//         error: err => {
//           this.LoginFailed(err);
//         }
//       });

//     this.formdata.reset();
//   }
//   StoreInternalUserInDataBase() {
//     const formData = new FormData();
//     formData.append("UserEmail", this.EmailId);
//     formData.append("CandidateName", this.CandidateName,);
//     formData.append("SupervisorName", this.SupervisorName);
//     formData.append("MobileNumber", this.MobileNo);
//     formData.append("SchoolName", this.Department);
//     formData.append("DepartmentName", this.DepartmentName);
//     formData.append("IdProofType", 'UMS ID');
//     formData.append("IdProofNumber", this.UserId);
//     formData.append("UserType", this.UserRole);
//     formData.append("Address", 'Internal User');
//     formData.append("PasswordText", btoa(this.SecretKey));
//     // formData.forEach((value, key) => {
//     //   console.log(key, value);
//     // });


//     this.CIFwebService.NewUserRecord(formData).subscribe({
//       next: (data) => {
//         let result = data.item1[0]['msg'];
//         let errorCode = data.item1[0]['returnId'];

//         if (result === 'Success') {
//           this.storeResult = 1;
//         } else if (errorCode === -1) {
//           this.storeResult = 0;
//         } else {
//           this.storeResult = -1;
//         }
//       },
//       error: (err) => {
//         return -1;
//       }
//     });
//   }
// }
