import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import swal from 'sweetalert2';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { DOCUMENT } from '@angular/common';



import { DataTable } from "simple-datatables";
import * as XLSX from 'xlsx';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

@Component({
  selector: 'app-CifLoginPage',
  templateUrl: './CifLoginPage.component.html',
  styleUrls: ['./CifLoginPage.component.scss'],
  standalone:false
})
export class CifLoginPageComponent implements OnInit {
  
  registrationNumber: any;      EmployeeDetails: any[] = [];    regdId: any;  DriveDropDown: any;  showNoDataFoundMessage: boolean;  UserData: any;
  isLoginFailed: boolean;  EmployeeName: any;  EmployeeCode: any;  Department: any;  DepartmentName: any;  loadingIndicator: boolean;  CandidateName: any;
  UserId: any;  Designation: any;  EmailId: any;  MobileNo: any;  UserRole: any;  SupervisorName: any;  ProofNumber: any;  ProofName: any;  SecretKey: any;
  showPassword: boolean = false;
  Email: any;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private mouDocumentsService: MouDocumentsService
  ) {}

  ngOnInit(): void {
    this.cookieService.delete('authData');
    this.AuthSession.clearSession();
  }
  loginError: string | null = null;

  formdata = new FormGroup({
    UserRoleS: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
 

  get email() {
    return this.formdata.get('Email');
  }

  get passwordText() {
    return this.formdata.get('password');
  }

  get userRole() {
    return this.formdata.get('UserRoleS');
  }
  CheckUserType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // console.log('Selected Role Value:', selectedValue);

    if (selectedValue === '') {
      console.warn('Please select a valid role.');
    } else {
      // console.log('Valid Role Selected:', selectedValue);
    }
  }
  OnSubmit() {

    var DataX = this.formdata.value;
    var uid = DataX.Email ?? '';
    var password = DataX.password ?? '';
    var encodeduid = btoa(uid);
    var encodedPassword = btoa(password);
    var userRoleX: number | null = null;

    if (DataX.UserRoleS !== null && DataX.UserRoleS !== undefined) {
      userRoleX = parseInt(DataX.UserRoleS as string);
      // this.AuthoriseUser(encodeduid, encodedPassword, userRoleX);
      // this.AuthoriseUser(uid, password, userRoleX);
      this.AuthoriseUserNewWay(uid, password, userRoleX);
    }

    if (this.formdata.invalid) {
      this.formdata.markAllAsTouched(); 
      return;
    }
  }

 
  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    });
    
  }


  AuthoriseUser(Id: any, Key: any, Role: number): void{
    this.CIFwebService.GetAuthoriseUserData(Id, Key, Role).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.UserData = response.item1;
          this.CandidateName = this.EmployeeName = response.item1[0].candidateName;
          this.UserId = this.EmployeeCode = Id;
          this.Department = response.item1[0].department;
          this.DepartmentName = response.item1[0].departmentName;
          this.Designation = response.item1[0].department;
          this.EmailId = response.item1[0].emailId;
          this.MobileNo = response.item1[0].mobileNumber;
          this.UserRole = response.item1[0].userRole;
          this.SupervisorName = response.item1[0].supervisorName;
          this.ProofNumber = btoa(response.item1[0].idProofNumber);
          this.ProofName = response.item1[0].idProofType;
          this.SecretKey = btoa(response.item1[0].passwordText);

          this.loadingIndicator = false;
          this.showNoDataFoundMessage = false;
          this.isLoginFailed = false;

          const userCookiesData = {
            CandidateName: this.CandidateName,
            UserId: Id,
            Department: this.Department,
            DepartmentName: this.DepartmentName,
            Designation: this.Designation,
            EmailId: this.EmailId,
            MobileNo: this.MobileNo,
            UserRole: this.UserRole,
            SupervisorName: this.SupervisorName,
            ProofNumber:this.ProofNumber,
            ProofName: this.ProofName,
            PasswordText: this.SecretKey,
          };

          // this.cookieService.set('authData', JSON.stringify(userCookiesData));
          // console.log("DATA " + JSON.stringify(userCookiesData))
          const UserCookies = JSON.stringify(userCookiesData);
          this.cookieService.set('authData', UserCookies);
          swal.fire({
            title: 'Login Successful',
            text: 'Login details are Valid!',
            icon: 'success',
          });
          this.AuthSession.addToSession(this.UserData);
          //  console.log(" Session Data = "+ JSON.stringify(this.AuthSession.getSession()));
          // this.router.navigate(['/ViewBookings']);
          // this.router.navigate(['/cifUserProfile']);
          this.router.navigate(['/CifTermsConditions']);
        } else {
          this.showNoDataFoundMessage = true;

          // this.loginError = 'Invalid credentials. Please try again.';
          swal.fire({
            title: 'Invalid Login Details ',
            text: 'Login details are Invalid!',
            icon: 'warning',
          });
        }
      },
      error: (err) => {
        // console.log(err);
        // this.loginError = 'Invalid credentials. Please try again.';
        swal.fire({
          title: 'Login Failed',
          text: 'Login details are Invalid!',
          icon: 'warning',
        });
      },
    });
    // this.formdata.reset();
    this.formdata.reset(); // Clear all form fields
    this.formdata.patchValue({
      UserRoleS: '', // Reset to default "Select Role" placeholder
    });
  }

  GetEmployeeDetails() {
    this.mouDocumentsService.GetEmployeeDetails().subscribe({
      next: (response) => {
        if (response.item1.length > 0) {
          this.EmployeeDetails = response.item1;

          this.CandidateName = this.EmployeeName =
          response.item1[0].employeeName;
          this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
          this.Department = response.item1[0].department;
          this.DepartmentName = response.item1[0].departmentName;
          this.Designation = response.item1[0].department;
          this.EmailId = response.item1[0].email;
          this.MobileNo = response.item1[0].contactNo;
          this.UserRole = 'Internal User';
          this.SupervisorName = response.item1[0].department; // Assuming supervisorName is in response.item1[0]

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
          };

          // Stringify and store the object in cookies
          this.cookieService.set('authData', JSON.stringify(userCookiesData));

          swal.fire({
            title: 'Login Successful',
            text: 'Login details are Valid!',
            icon: 'success',
          });
          this.AuthSession.addToSession(this.EmployeeDetails);
          //  console.log(" Session Data = "+ JSON.stringify(this.AuthSession.getSession()));
          // this.router.navigate(['/cifDashboards']);
          this.router.navigateByUrl('/cifDashboards').then(() => {
            window.location.reload();
          });
        } else {
          this.EmployeeDetails = [];
          this.showNoDataFoundMessage = true;
          this.isLoginFailed = true;
        }
      },
      error: (err) => {
        this.LoginFailed(err);
      },
    });

    this.formdata.reset();
  }


 
  AuthoriseUserNewWay(Id: any, Key: any, Role: any): void {   
    this.CIFwebService.GetAuthoriseUserData(Id, Key, Role).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.Email = response.item1[0].email;
          this.CreateToken(this.Email, response);
        } else {
          this.showNoDataFoundMessage = true;
          swal.fire({
            text: 'Check Details!',
            title: 'Invalid Login Details',
            icon: 'warning',
          });
        }
      },
      error: (err) => {
        console.log(err);

        // Check for different error types
        if (err.status === 0) {
          // Network or server is down
          swal.fire({
            text: 'The server is currently unavailable. Please try again later.',
            title: 'Server Down',
            icon: 'error',
          });
        } else {
          // Other API error responses
          swal.fire({
            text: 'An error occurred while processing your request. Please try again later.',
            title: 'Error',
            icon: 'error',
          });
        }
      },
      complete: () => {
        this.formdata.reset();
      }
    });
}

  
AccessToken: any;

CreateToken(Id: any, response: any) {
  this.authService.LoginJournalAccessTemp(Id).subscribe({
    next: data => {
      this.storageService.saveUser(data);
      this.SetUserData(response);
     
    },
    error: err => {
      this.loadingIndicator = false;
      this.showNoDataFoundMessage = false;
      this.isLoginFailed = false;
    }
  });
}

SetUserData(response: any) {
  this.UserData = response.item1;
  this.CandidateName = this.EmployeeName = response.item1[0].candidateName;
  this.UserId = this.EmployeeCode = this.EmailId;
  this.Department = response.item1[0].department;
  this.DepartmentName = response.item1[0].departmentName;
  this.Designation = response.item1[0].department;
  this.EmailId = response.item1[0].emailId;
  this.MobileNo = response.item1[0].mobileNumber;
  this.UserRole = response.item1[0].userRole;
  this.SupervisorName = response.item1[0].supervisorName;
  this.ProofNumber = btoa(response.item1[0].idProofNumber);
  this.ProofName = response.item1[0].idProofType;
  this.SecretKey = btoa(response.item1[0].passwordText);

  this.loadingIndicator = false;
  this.showNoDataFoundMessage = false;
  this.isLoginFailed = false;

  const userCookiesData = {
    CandidateName: this.CandidateName,
    UserId: this.EmailId,
    Department: this.Department,
    DepartmentName: this.DepartmentName,
    Designation: this.Designation,
    EmailId: this.EmailId,
    MobileNo: this.MobileNo,
    UserRole: this.UserRole,
    SupervisorName: this.SupervisorName,
    ProofNumber:this.ProofNumber,
    ProofName: this.ProofName,
    PasswordText: this.SecretKey,
  };

  // this.cookieService.set('authData', JSON.stringify(userCookiesData));
  // console.log("DATA " + JSON.stringify(userCookiesData))
  const UserCookies = JSON.stringify(userCookiesData);
  this.cookieService.set('authData', UserCookies);
  swal.fire({
    title: 'Login Successful',
    text: 'Login details are Valid!',
    icon: 'success',
  });
  this.AuthSession.addToSession(this.UserData);
  //  console.log(" Session Data = "+ JSON.stringify(this.AuthSession.getSession()));
  // this.router.navigate(['/ViewBookings']);
  // this.router.navigate(['/cifUserProfile']);
  this.router.navigate(['/CifTermsConditions']);
// } else {
//   this.showNoDataFoundMessage = true;

//   // this.loginError = 'Invalid credentials. Please try again.';
//   swal.fire({
//     title: 'Invalid Login Details ',
//     text: 'Login details are Invalid!',
//     icon: 'warning',
//   });

//   this.cookieService.set('authData', JSON.stringify(userCookiesData));

//   swal.fire({
//     title: 'Login Successful',
//     text: '..',
//     icon: 'success',
//     confirmButtonText: 'OK'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.AuthSession.addToSession(this.UserData);
//     }
//   });
 
}

}