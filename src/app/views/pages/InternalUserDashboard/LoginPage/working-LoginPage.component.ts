// import { FormControl, FormGroup } from '@angular/forms';
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
//   selector: 'app-LoginPage',
//   templateUrl: './LoginPage.component.html',
//   styleUrls: ['./LoginPage.component.scss']
// })
// export class LoginPageNComponent implements OnInit {
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
//   storeResult: number=0;

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
//     // this.cookieService.delete('authData');
//     // this.AuthSession.clearSession();
//     // (<HTMLInputElement>document.getElementById('stMain')).innerHTML = 'Central Instument Facility <span class="themeClr" >Portal </span>';
//     // (<HTMLInputElement>document.getElementById('imgLogo')).style.width = '164px';
//   }


//   formdata = new FormGroup({
//     Email: new FormControl('', [Validators.required, Validators.minLength(5)]),
//     password: new FormControl('', [Validators.required, Validators.minLength(5)]),
//   })
//   get email() {
//     return this.formdata.get('Email');
//   }
//   get passwordText() {
//     return this.formdata.get('password')
//   }

//   OnSubmit() {
//     var DataX = this.formdata.value;
//     var uid = DataX.Email;
//     this.SecretKey = DataX.password;
//     this.getToken(uid, this.SecretKey);
//   }


//   getToken(id: any, key: any) {
//     this.cookieService.delete('authData');
//     this.AuthSession.clearSession();
//     this.authService.loginInternalUser(id, key).subscribe({
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
//     this.mouDocumentsService.GetEmployeeDetails().subscribe({
//       next: response => {
//         if (response.item1.length > 0) {
//           this.EmployeeDetails = response.item1;
//           this.CandidateName = this.EmployeeName = response.item1[0].employeeName;
//           this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
//           this.Department = response.item1[0].department;
//           this.DepartmentName = response.item1[0].departmentName;
//           this.Designation = response.item1[0].department;
//           this.EmailId = response.item1[0].email.length > 3 ? response.item1[0].email : response.item1[0].officialEmailId;
//           this.MobileNo = response.item1[0].contactNo;
//           this.UserRole = '400000'; 
//           this.SupervisorName = this.EmployeeName;
  
//           this.loadingIndicator = false;
//           this.showNoDataFoundMessage = false;
//           this.isLoginFailed = false;
//           var DataX = this.formdata.value;
//           // this.SecretKey = DataX.password ?? '';
//           const userCookiesData = {
//             CandidateName: this.CandidateName,
//             UserId: this.UserId,
//             Department: this.Department,
//             DepartmentName: this.DepartmentName,
//             Designation: this.Designation,
//             EmailId: this.EmailId,
//             MobileNo: this.MobileNo,
//             UserRole: this.UserRole,
//             SupervisorName: this.SupervisorName,
//             ProofNumber: this.MobileNo,
//             ProofName: 'Mobile ',
//             PasswordText: this.SecretKey,
//           };
//           this.cookieService.set('authData', JSON.stringify(userCookiesData));
//           swal.fire({
//             title: 'Login Successful',
//             text: 'Login details are Valid!',
//             icon: 'success',
//           })
//           this.AuthSession.addToSession(this.EmployeeDetails);
          
//           // Call StoreInternalUserInDataBase and handle the redirection inside it.
//           this.StoreInternalUserInDataBase().then(() => {
//             // Check the storeResult after the async operation
//             if (this.storeResult == 1 || this.storeResult == 2) {
//               this.router.navigate(['/ViewBookings']);
//             } else {
//               this.LoginFailed('Error in Login');
//             }
//           }).catch((err) => {
//             this.LoginFailed(err);
//           });
          
//         } else {
//           this.EmployeeDetails = [];
//           this.showNoDataFoundMessage = true;
//           this.isLoginFailed = true;
//         }
//       },
//       error: err => {
//         this.LoginFailed(err);
//       }
//     });
  
//     this.formdata.reset();
//     //   next: response => {
//     //     if (response.item1.length > 0) {
//     //       this.EmployeeDetails = response.item1;
//     //       this.CandidateName = this.EmployeeName = response.item1[0].employeeName;
//     //       this.UserId = this.EmployeeCode = response.item1[0].employeeCode;
//     //       this.Department = response.item1[0].department;
//     //       this.DepartmentName = response.item1[0].departmentName;
//     //       this.Designation = response.item1[0].department;
//     //       this.EmailId = response.item1[0].email.length>3 ? response.item1[0].email : response.item1[0].officialEmailId;
//     //       this.MobileNo = response.item1[0].contactNo;
//     //       this.UserRole = '400000'; // Assuming userRole is in response.item1[0]
//     //       this.SupervisorName = this.EmployeeName; // Assuming supervisorName is in response.item1[0]

//     //       this.loadingIndicator = false;
//     //       this.showNoDataFoundMessage = false;
//     //       this.isLoginFailed = false;
//     //       var DataX = this.formdata.value;
//     //       // this.SecretKey = DataX.password ?? '';
//     //       const userCookiesData = {
//     //         CandidateName: this.CandidateName,
//     //         UserId: this.UserId,
//     //         Department: this.Department,
//     //         DepartmentName: this.DepartmentName,
//     //         Designation: this.Designation,
//     //         EmailId: this.EmailId,
//     //         MobileNo: this.MobileNo,
//     //         UserRole: this.UserRole,
//     //         SupervisorName: this.SupervisorName,
//     //         ProofNumber: this.MobileNo,
//     //         ProofName: 'Mobile ',
//     //         PasswordText: this.SecretKey,
//     //       };
//     //       this.cookieService.set('authData', JSON.stringify(userCookiesData));
//     //       swal.fire({
//     //         title: 'Login Successful',
//     //         text: 'Login details are Valid!',
//     //         icon: 'success',
//     //       })
//     //       this.AuthSession.addToSession(this.EmployeeDetails);
//     //       this.StoreInternalUserInDataBase();
//     //       this.router.navigate(['/ViewBookings']);
//     //       if (this.storeResult == 1 || this.storeResult == 2) {
//     //           this.router.navigate(['/CifTermsConditions']);              
//     //       }
//     //       else{
//     //         this.LoginFailed('Error in Login');
//     //       }
//     //     } else {
//     //       this.EmployeeDetails = [];
//     //       this.showNoDataFoundMessage = true;
//     //       this.isLoginFailed = true;
//     //     }
//     //   },
//     //   error: err => {
//     //     this.LoginFailed(err);
//     //   }
//     // });

//     // this.formdata.reset();
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
//     return new Promise<void>((resolve, reject) => {
//       this.CIFwebService.NewUserRecord(formData).subscribe({
//         next: (data) => {
//           let result = data.item1[0]['msg'];
//           let errorCode = data.item1[0]['returnId'];
  
//           if (result === 'Success') {
//             this.storeResult = 1;
//             resolve(); 
//           } else if (result === 'Already Stored') {
//             this.storeResult = 2;
//             resolve(); 
//           } else if (errorCode === -1) {
//             this.storeResult = -1;
//             reject('Error in user storage');
//           }
//         },
//         error: (err) => {
//           this.storeResult = -1;
//           reject(err);
//         }
//       });
//     });
//   }
  
// }
 
