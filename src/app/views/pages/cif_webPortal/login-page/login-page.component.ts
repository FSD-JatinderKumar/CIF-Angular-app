import { FormControl, FormGroup } from '@angular/forms';
import { Component,  OnInit,} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import {
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  registrationNumber: any;
  EmployeeDetails: any[] = [];
  regdId: any;
  DriveDropDown: any;
  showNoDataFoundMessage: boolean;
  UserData: any;
  isLoginFailed: boolean;
  EmployeeName: any;
  EmployeeCode: any;
  Department: any;
  DepartmentName: any;
  loadingIndicator: boolean;
  CandidateName: any;
  UserId: any;
  Designation: any;
  EmailId: any;
  MobileNo: any;
  UserRole: any;
  SupervisorName: any;
  ProofNumber: any;
  ProofName: any;
  SecretKey: any;

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

  formdata = new FormGroup({
    UserRoleS: new FormControl('Select', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
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
  CheckUserType(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const UserRole = Array.from(selectElement.options).findIndex(
      (option) => option.value === selectedValue
    );
    // if (UserRole === 1) {
    //   this.router.navigate(['/InternalUserLogin']);
    // }

    // swal.fire({ title: "Selected School ID:", text: selectedIdString, icon: "success" });
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
      this.AuthoriseUser(uid, password, userRoleX);
    }
  }

  // getToken(id: any, key: any) {
  //   this.authService.loginInternalUser(id, key).subscribe({
  //     next: (data) => {
  //       this.storageService.saveUser(data.token);
  //       this.GetEmployeeDetails();
  //     },
  //     error: (_err) => {
  //       this.LoginFailed(_err);
  //     },
  //   });
  // }

  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    });
    // const element = document.getElementById('ActivityTakeActionPage');
    // if (element) {
    //   element.hidden = true;
    // }
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
          swal.fire({
            title: 'Invalid Login Details ',
            text: 'Login details are Invalid!',
            icon: 'warning',
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.formdata.reset();
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
          this.router.navigate(['/cifDashboards']);
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
}
