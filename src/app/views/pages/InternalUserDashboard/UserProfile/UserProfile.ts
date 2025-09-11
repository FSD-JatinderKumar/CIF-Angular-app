import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './UserProfile.html',
  styleUrls: ['./UserProfile.scss'],
})
export class UserProfile implements OnInit {
  cifUserForm!: FormGroup;
  isForm1Submitted = false;
  isEditMode = false;
  UserDetails: any;
  isLoading = false;
  isSubmitted = false;
  submissionError = false;
  submissionSuccess = false;

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private CIFwebService: LpuCIFWebService
  ) {}

  ngOnInit(): void {
   this.loadForm();
    this.populateUserData();
  }

  loadForm(): void {
    this.cifUserForm = this.fb.group({
      EmailId: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(150)]],
      CandidateName: ['', [Validators.required, Validators.maxLength(30)]],
      SupervisorName: ['', [Validators.required, Validators.maxLength(30)]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      InstituteName: ['', [Validators.required, Validators.maxLength(30)]],
      DepartmentName: ['', [Validators.required, Validators.maxLength(30)]],
      IdProofType: ['', Validators.required],
      IdProofNumber: ['', [Validators.required, Validators.maxLength(15)]],
      Address: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  populateUserData() {
    const GetCookieData = this.cookieService.get('InternalUserAuthData');
    if (!GetCookieData) {
      // Handle no cookie or redirect to login
      return;
    }
    const retrievedCookies = JSON.parse(GetCookieData);

    this.CIFwebService.CIFGetUserDetails(retrievedCookies.EmailId).subscribe({
      next: (data) => {
        this.UserDetails = data.item1[0];
        console.log('User  Details:', JSON.stringify( this.UserDetails));

        this.cifUserForm.patchValue({
          EmailId:        retrievedCookies.EmailId,
          CandidateName:  this.UserDetails.candidateName || '',
          SupervisorName: this.UserDetails.supervisorName || '',
          MobileNumber:   this.UserDetails.mobileNumber || '',
          InstituteName:  this.UserDetails.organisation || '',
          DepartmentName: this.UserDetails.departmentName || '',
          IdProofType:    this.UserDetails.idProofType || '',
          IdProofNumber:  this.UserDetails.idProofNumber || '',
          Address:        this.UserDetails.address || '',
        });

        // Disable form initially (view mode)
        this.cifUserForm.disable();
        this.cifUserForm.get('EmailId')?.disable(); // ensure email disabled
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  get form1() {
    return this.cifUserForm.controls;
  }

  onEdit() {
    this.isEditMode = true;
    this.isForm1Submitted = false;
    this.cifUserForm.enable();
    this.cifUserForm.get('EmailId')?.disable(); // keep email disabled
  }

  onUpdate() {
    this.isForm1Submitted = true;

    if (this.cifUserForm.valid) {
      this.isEditMode = false;
      this.cifUserForm.disable();
      this.cifUserForm.get('EmailId')?.disable();

      const updatedData = this.cifUserForm.getRawValue();
      console.log('Updated profile:', updatedData);

      this.isSubmitted = true;
      this.isLoading = true;
      this.submissionError = false;
      this.submissionSuccess = false;

      const formData = new FormData();
      formData.append("CandidateName", updatedData.CandidateName);
      formData.append("SupervisorName", updatedData.SupervisorName);
      formData.append("MobileNumber", updatedData.MobileNumber);
      formData.append("InstituteName", updatedData.InstituteName);
      formData.append("DepartmentName", updatedData.DepartmentName);
      formData.append("IdProofType", updatedData.IdProofType);
      formData.append("IdProofNumber", updatedData.IdProofNumber);
      formData.append("Address", updatedData.Address);
      formData.append("User Email", updatedData.EmailId);

      this.CIFwebService.UpdateUserDetails(formData).subscribe({
        next: (data) => {
          let result = data.item1[0]['msg'];
          let errorCode = data.item1[0]['returnId'];

          if (result === 'Success') {
            swal.fire({
              title: 'Details Updated Successfully',
              text: data.item1[0]['msg'],
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else if (errorCode === -1) {
            swal.fire({
              title: 'Already Submitted',
              icon: 'error',
            }).then(() => {
              window.location.reload();
            });
          } else {
            swal.fire({
              title: 'Some Technical Issue',
              text: result,
              icon: 'error',
            }).then(() => {
              window.location.reload();
            });
          }
        },
        error: () => {
          swal.fire({
            title: 'Error Occurred',
            text: 'Unable to complete the request. Please try again later.',
            icon: 'error',
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      console.log('Form invalid');
    }
  }
}




// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { DOCUMENT, Location } from '@angular/common';
// import { DatePipe } from '@angular/common';
// import swal from 'sweetalert2';
// @Component({
//   standalone: false,
//   selector: 'app-User Profile',
//   templateUrl: './UserProfile.html',
//   styleUrls: ['./UserProfile.scss'],
//   providers: [DatePipe]
// })
// export class UserProfile implements OnInit {
//   cifUserForm!: FormGroup;
//   isForm1Submitted = false;
//   isEditMode = false;

//   // User data variables (optional, you can remove if not used)
//   user_Email: any;
//   MobileNo: any;
//   supervisorName: any;
//   departmentName: any;
//   candidateName: any;
//   UserRole: any;
//   instituteName: any;
//   idProofType: any;
//   idProofNumber: any;
//   address: any;
//   isSubmitted: boolean;
//   feedbackForm: any;
//   isLoading: boolean;
//   submissionError: boolean;
//   submissionSuccess: boolean;
//   UserDetails: any;
//   constructor(
//     private fb: FormBuilder,
//     private cookieService: CookieService,
//     private CIFwebService: LpuCIFWebService  ) { }

//   ngOnInit(): void {
//     this.loadForm();
//     this.populateUserData();
//   }

//   loadForm(): void {
//     this.cifUserForm = this.fb.group({
//       EmailId: [{ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(150)]],
//       CandidateName: ['', [Validators.required, Validators.maxLength(30)]],
//       Supervisorname: ['', [Validators.required, Validators.maxLength(30)]],
//       MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//       InstituteName: ['', [Validators.required, Validators.maxLength(30)]],
//       DepartmentName: ['', [Validators.required, Validators.maxLength(30)]],
//       IdProofType: ['', Validators.required],
//       IdProofNumber: ['', [Validators.required, Validators.maxLength(15)]],
//       Address: ['', [Validators.required, Validators.maxLength(150)]],
//     });
//   }


//   populateUserData() {
//     const GetCookieData = this.cookieService.get('InternalUserAuthData');
//     if (!GetCookieData) {
//       // Handle no cookie or redirect to login
//       return;
//     }
//     const retrievedCookies = JSON.parse(GetCookieData);
//     //CIFGetUserDetails
//     this.CIFwebService.CIFGetUserDetails(retrievedCookies.EmailId).subscribe({
//       next: (data) => {
//         this.UserDetails = data.item1;
//         console.log(this.UserDetails)
//         this.cifUserForm.patchValue({
//           EmailId:        this.UserDetails['emailId'] || '',
//           CandidateName:  this.UserDetails['candidateName'] || '',
//           SupervisorName: this.UserDetails['supervisorName'] || '',
//           MobileNumber:   this.UserDetails['mobileNumber'] || '',
//           InstituteName:  this.UserDetails['organisation'] || '',
//           DepartmentName: this.UserDetails['departmentName'] || '',
//           IdProofType:    this.UserDetails['idProofType'] || '',
//           IdProofNumber:  this.UserDetails['idProofNumber'] || '',
//           Address:        this.UserDetails['address'] || '',
//         });
        

//     // Disable form initially (view mode)
//     this.cifUserForm.disable();
//     this.cifUserForm.get('EmailId')?.disable(); // ensure email disabled
//       }
//     })
  
   
//   }

//   get form1() {
//     return this.cifUserForm.controls;
//   }

//   onEdit() {
//     this.isEditMode = true;
//     this.isForm1Submitted = false;
//     this.cifUserForm.enable();
//     this.cifUserForm.get('EmailId')?.disable(); // keep email disabled
//   }

//   onUpdate() {
//     this.isForm1Submitted = true;

//     if (this.cifUserForm.valid) {
//       this.isEditMode = false;
//       this.cifUserForm.disable();
//       this.cifUserForm.get('EmailId')?.disable();

//       // Here you can call your API to update the user profile
//       const updatedData = this.cifUserForm.getRawValue();
//       console.log('Updated profile:', updatedData);

//       this.isSubmitted = true; // Track if the form has been submitted
//       if (this.cifUserForm.invalid) {
//         return;
//       }

//       this.isLoading = true; // Start loading
//       this.submissionError = false;
//       this.submissionSuccess = false;

//       const formData = new FormData();
//       formData.append("CandidateName", updatedData.CandidateName);
//       formData.append("SupervisorName", updatedData.Supervisorname);
//       formData.append("MobileNumber", updatedData.MobileNumber);
//       formData.append("InstituteName", updatedData.InstituteName);
//       formData.append("DepartmentName", updatedData.DepartmentName);
//       formData.append("IdProofType", updatedData.IdProofType);
//       formData.append("IdProofNumber", updatedData.IdProofNumber);
//       formData.append("Address", updatedData.Address);
//       formData.append("UserEmail", updatedData.EmailId);
//       //       // formData.append("RequestDate", this.LoginId);
//       // formData.forEach((value, key) => {
//       //   console.log(key, value);
//       // });
//       this.CIFwebService.UpdateUserDetails(formData).subscribe({
//         next: (data) => {
//           let result = data.item1[0]['msg'];
//           let errorCode = data.item1[0]['returnId'];

//           if (result === 'Success') {
//             swal.fire({
//               title: 'Details Updated Successfully',
//               text: data.item1[0]['msg'],
//               icon: 'success',
//             }).then(() => {
//               window.location.reload();
//             });
//           } else if (errorCode === -1) {
//             swal.fire({
//               title: 'Already Submitted',
//               icon: 'error',
//             }).then(() => {
//               window.location.reload();
//             });
//           } else {
//             swal.fire({
//               title: 'Some Technical Issue',
//               text: result,
//               icon: 'error',
//             }).then(() => {
//               window.location.reload();
//             });
//           }
//         },
//         error: () => {
//           swal.fire({
//             title: 'Error Occurred',
//             text: 'Unable to complete the request. Please try again later.',
//             icon: 'error',
//           });
//         },
//         complete: () => {
//           this.isLoading = false; // Stop loading after request completes
//         }
//       });
//     } else {
//       // Scroll to first error or show message
//       console.log('Form invalid');
//     }
//   }
//   rating() {
//     throw new Error('Method not implemented.');
//   }
//   Comments() {
//     throw new Error('Method not implemented.');
//   }
//   Suggestions() {
//     throw new Error('Method not implemented.');
//   }
// }
