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
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { CookieService } from 'ngx-cookie-service';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.scss'],
  // standalone: false
})
export class LoginPageNComponent implements OnInit {
  registrationNumber: any; regdId: any; DriveDropDown: any; showNoDataFoundMessage: boolean; UserData: any; isLoginFailed: boolean;
  EmployeeDetails: any; EmployeeName: any; EmployeeCode: any; Department: any; DepartmentName: any; loadingIndicator: boolean; CandidateName: any;
  UserId: any; Designation: any; EmailId: any; MobileNo: any; UserRole: any; SupervisorName: any; SecretKey: any; storeResult: number = 0;

  showPassword: boolean = false;
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
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService,
    private mouDocumentsService: MouDocumentsService,
  ) { }

  ngOnInit(): void {
  }


  formdata = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    UserRoleS: new FormControl('', [Validators.required]),
  })
  get email() {
    return this.formdata.get('Email');
  }
  get passwordText() {
    return this.formdata.get('password')
  }

  OnSubmit() {
    var DataX = this.formdata.value;
    var uid = DataX.Email;
    this.SecretKey = DataX.password;
    this.UserRole = DataX.UserRoleS;
    this.getToken(uid, this.SecretKey, this.UserRole);
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


  get userRole() {
    return this.formdata.get('UserRoleS');
  }

  getToken(id: any, key: any, Role: any) {
    // this.cookieService.delete('authData');
    // this.AuthSession.clearSession();
    if (Role === 'Staff') {
      this.authService.loginInternalUser(id, key).subscribe({
        next: data => {
          this.storageService.saveUser(data.token);
          this.GetEmployeeDetails();
        },
        error: _err => {
          this.LoginFailed(_err);
        }
      });
    }
    else if (Role === 'Student') {
      // alert(Role);
      this.authService.loginInternalUser(id, key).subscribe({
        next: data => {
          this.storageService.saveUser(data.token);
          this.getStudentById(id);
        },
        error: _err => {
          this.LoginFailed(_err);
        }
      });
    }

  }
  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    })
    this.formdata.reset();
  }
  getStudentById(regNo: any) {
    this.CIFwebService.getStudentById(regNo).subscribe({
      next: response => {
        if (response.item1.length > 0) {
          this.EmployeeDetails = response.item1;
          // console.log(JSON.stringify(this.EmployeeDetails))
          // [{"registerationNumber":"12300156","studentName":"Ahmed Abdalrahman Ahmed Suliman","studentMobile":"xxxxxx812","officialEmail":"AXXX@XXXX.com","studentEmail":"aXXX@XXXX.com","batchYear":2023,"programCode":2557,"courseName":"B.Tech. (Information Technology)","cgpa":4.46,"cgpA1":2.55,"cgpA2":6.08,"cgpA3":null,"cgpA4":null,"cgpA5":null,"cgpA6":null,"cgpA7":null,"cgpA8":null,"cgpA9":null,"cgpA10":null,"cgpA11":null,"cgpA12":null,"schoolName":"Lovely Faculty of Technology and Sciences","courseTotalDuration":"4","courseTotalTerms":"8","currentYear":"2","currentTerm":"4","studentStatus":"A"}]
          this.CandidateName = this.EmployeeName = response.item1[0].studentName;
          this.UserId = this.EmployeeCode = response.item1[0].registerationNumber;
          this.Department = response.item1[0].schoolName;
          this.DepartmentName = response.item1[0].courseName;
          this.Designation = "Student";
          this.EmailId = response.item1[0].officialEmail.length > 3 ? response.item1[0].officialEmail : response.item1[0].studentEmail;
          this.MobileNo = response.item1[0].studentMobile;
          this.UserRole = '400000';
          this.SupervisorName = 'N-A';

          this.loadingIndicator = false;
          this.showNoDataFoundMessage = false;
          this.isLoginFailed = false;
          var DataX = this.formdata.value;
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
            ProofName: 'Mobile ',
            PasswordText: this.SecretKey,
          };
          this.cookieService.set('authData', JSON.stringify(userCookiesData));
          // swal.fire({
          //   title: 'Login Successful',
          //   text: 'Login details are Valid!',
          //   icon: 'success',
          // })
          this.AuthSession.addToSession(this.EmployeeDetails);

          this.StoreInternalUserInDataBase().then(() => {
            // Check the storeResult after the async operation
            if (this.storeResult == 1 || this.storeResult == 2) {
              this.router.navigateByUrl('NewBookings').then(() => {
                window.location.reload();
              });
            } else {
              this.LoginFailed('Error in Login');
            }
          }).catch((err) => {
            this.LoginFailed(err);
          });

        } else {
          this.EmployeeDetails = [];
          this.showNoDataFoundMessage = true;
          this.isLoginFailed = true;
        }
      },
      error: err => {
        this.LoginFailed(err);
      }
    });
    this.formdata.reset();
  }
  GetEmployeeDetails() {
    this.mouDocumentsService.GetEmployeeDetails().subscribe({
      next: response => {
        if (response.item1.length > 0) {
          this.EmployeeDetails = response.item1;
          this.CandidateName = this.EmployeeName = response.item1[0].employeeName;
          this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
          this.Department = response.item1[0].department;
          this.DepartmentName = response.item1[0].departmentName;
          this.Designation = response.item1[0].department;
          this.EmailId = response.item1[0].email?.length > 3 ? response.item1[0].email : response.item1[0].officialEmailId;
          this.MobileNo = response.item1[0].contactNo;
          this.UserRole = '400000';
          this.SupervisorName = this.EmployeeName;

          this.loadingIndicator = false;
          this.showNoDataFoundMessage = false;
          this.isLoginFailed = false;
          var DataX = this.formdata.value;
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
            ProofName: 'Mobile ',
            PasswordText: this.SecretKey,
          };
          this.cookieService.set('authData', JSON.stringify(userCookiesData));

          this.AuthSession.addToSession(this.EmployeeDetails);

          this.StoreInternalUserInDataBase().then(() => {
            // Check the storeResult after the async operation
            if (this.storeResult == 1 || this.storeResult == 2) {
              // this.router.navigate(['/PendingPayments']);

              swal.fire({
                title: 'Terms Conditions',
                text: 'Do you agree with terms Conditions?',
                html: `
                <div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px;">
                  <p>
                    Welcome to Lovely Professional University. These terms and conditions outline the rules and regulations for the use of Lovely Professional University's Website, located at lpu.co.in
                  </p>
              
                  <p style="font-weight: bold;">You specifically agree to all of the following undertakings:</p>
              
                  <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <p style="margin-bottom: 8px;">
                      <span style="background: #ff9219; padding: 5px 10px; color: #000; border-radius: 4px; display: inline-block;">
                        •    We agree to acknowledge CIF, LPU in our publications and thesis if the results from CIF instrumentation are incorporated/used in them.
                      </span>
                    </p>
                    <p style="margin-bottom: 8px;">• I/We undertake to abide by the safety, standard sample preparation guidelines and precautions during testing of samples.</p>
                    <p style="margin-bottom: 8px;">• I/We do understand the possibility of samples getting damaged during handling and analysis. I/We shall not claim for any loss/damage of the sample submitted to CIF and agreed to resubmit the new sample requested by CIF for analysis.</p>
                    <p style="margin-bottom: 8px;">• CIF, LPU reserves the rights to return the samples without performing analysis and will refund the analytical charges (after deduction of GST, if applicable) under special circumstances.</p>
                    <p style="margin-bottom: 8px;">• I/we do agree to maintain the decorum during the visit in CIF labs for sample analysis and fully agreed that CIF has full right to take action, if decorum of CIF’s labs functionality is disturbed/hampered by me.</p>
                    <p style="margin-bottom: 8px;">• CIF shall not take any responsibility about the analysis, interpretation and publication of data acquired by the end user.</p>
                    <p style="margin-bottom: 8px;">• I/We hereby declare that the results of the analysis will not be used for the settlement of any legal issue.</p>
                  </ul>
                </div>
              `,
              
              customClass: {
                popup: 'swal-wide'
              },
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes, Agreed',
                cancelButtonText: 'No',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.AuthSession.addToSession(this.UserData);

                  this.router.navigateByUrl('/CifTermsConditions').then(() => {
                    window.location.reload();
                  });
                } else {
                  swal.fire({
                    title: 'Agreement Required',
                    text: 'You must agree to proceed further.',
                    icon: 'warning',
                  }).then(() => {
                    this.LogoutUser(); // implement this to clear session/cookies and redirect to login
                  });
                }
              });
            } else {
              this.LoginFailed('Error in Login');
            }
          }).catch((err) => {
            this.LoginFailed(err);
          });

        } else {
          this.EmployeeDetails = [];
          this.showNoDataFoundMessage = true;
          this.isLoginFailed = true;
        }
      },
      error: err => {
        this.LoginFailed(err);
      }
    });

    this.formdata.reset();

  }
  StoreInternalUserInDataBase() {
    const formData = new FormData();
    formData.append("UserEmail", this.EmailId);
    formData.append("CandidateName", this.CandidateName,);
    formData.append("SupervisorName", this.SupervisorName);
    formData.append("MobileNumber", this.MobileNo);
    formData.append("SchoolName", this.Department);
    formData.append("DepartmentName", this.DepartmentName);
    formData.append("IdProofType", 'UMS ID');
    formData.append("IdProofNumber", this.UserId);
    formData.append("UserType", this.UserRole);
    formData.append("Address", 'Internal User');
    formData.append("PasswordText", btoa(this.SecretKey));
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    return new Promise<void>((resolve, reject) => {
      this.CIFwebService.NewUserRecord(formData).subscribe({
        next: (data) => {
          let result = data.item1[0]['msg'];
          let errorCode = data.item1[0]['returnId'];

          if (result === 'Success') {
            this.storeResult = 1;
            resolve();
          } else if (result === 'Already Stored') {
            this.storeResult = 2;
            resolve();
          } else if (errorCode === -1) {
            this.storeResult = -1;
            reject('Error in user storage');
          }
        },
        error: (err) => {
          this.storeResult = -1;
          reject(err);
        }
      });
    });
  }

  VisitUrl(Id: any, name: any, Sufix: any) {
    this.router.navigateByUrl(Id + '/' + name + '/' + Sufix).then(() => {
      window.location.reload();
    });
  }

  LogoutUser() {
    this.cookieService.delete('authData');
    this.AuthSession.clearSession(); // if you have a method like this
    this.router.navigateByUrl('/login'); // adjust to your login path
  }

}

