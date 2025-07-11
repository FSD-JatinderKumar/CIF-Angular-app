import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
import { warn } from 'console';
import { FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-UserFeedbackForm',
  templateUrl: './UserFeedbackForm.component.html',
  styleUrls: ['./UserFeedbackForm.component.css']
})
export class UserFeedbackFormComponent implements OnInit {
  UserSessionData: any; UserRole: any; UserId: any; user_Email: any; supervisorName: any; departmentName: any; candidateName: any;
  MobileNo: any;

  feedbackForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  submissionSuccess = false;
  submissionError = false;


  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) {
  }
  loadForm() {
    this.feedbackForm = this.fb.group({
      name: ['',],
      email: [this.user_Email, [Validators.required, Validators.email]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      CifComments: ['', Validators.required],
      suggestions: ['', Validators.required],
    });
  }
 
  name: any;    Comments: any;  rating: any;  Suggestions: any;
  onSubmit(): void {
    this.isSubmitted = true; // Track if the form has been submitted
    if (this.feedbackForm.invalid) {
      return;
    }
  
    this.isLoading = true; // Start loading
    this.submissionError = false;
    this.submissionSuccess = false;
  
    const formData = new FormData();
    formData.append("EmailId", this.user_Email);
    formData.append("Rating", this.rating);
    formData.append("Comments", this.Comments);
    formData.append("Suggestions", this.Suggestions);
    //  formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    this.CIFwebService.NewCifFeedback(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];
  
        if (result === 'Success') {
          swal.fire({
            title: 'Feedback Stored Successfully',
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
      error: (err) => {
        swal.fire({
          title: 'Error Occurred',
          text: 'Unable to complete the request. Please try again later.',
          icon: 'error',
        });
      },
      complete: () => {
        this.isLoading = false; // Stop loading after request completes
      }
    });
  
    // No need for setTimeout here
  }
  
  // onSubmit(): void {
  //   if (this.feedbackForm.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.submissionError = false;
  //   this.submissionSuccess = false;

  //   if (this.feedbackForm.valid) {
  //     const formData = new FormData();
  //     formData.append("EmailId", this.user_Email);
  //     formData.append("Rating", this.rating);
  //     formData.append("Comments", this.Comments);
  //     formData.append("Suggestions", this.Suggestions);

  //     this.CIFwebService.NewCifFeedback(formData).subscribe({
  //       next: (data) => {
  //         let result = data.item1[0]['msg'];
  //         let errorCode = data.item1[0]['returnId'];

  //         if (result === 'Success') {
  //           swal.fire({
  //             title: 'Feedback Stored Successfully',
  //             text: data.item1[0]['msg'],
  //             icon: 'success',
  //           }).then(() => {
  //             window.location.reload();
  //           });
  //         } else if (errorCode === -1) {
  //           swal.fire({
  //             title: 'Already Submitted',
  //             icon: 'error',
  //           }).then(() => {
  //             window.location.reload();
  //           });
  //         } else {
  //           swal.fire({
  //             title: 'Some Technical Issue',
  //             text: result,
  //             icon: 'error',
  //           }).then(() => {
  //             window.location.reload();
  //           });
  //         }
  //       },
  //       error: (err) => {
  //         swal.fire({
  //           title: 'Error Occurred',
  //           text: 'Unable to complete the request. Please try again later.',
  //           icon: 'error',
  //         });
  //       }
  //     });
  //     setTimeout(() => {
  //       this.isLoading = false;
  //     }, 2500);
  //   } else {
  //     this.feedbackForm.markAllAsTouched();
  //   }
  //   this.isLoading = false;
  //   this.submissionError = true;
  // }


  get f() {
    return this.feedbackForm.controls;
  }

  ngOnInit() {

    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.MobileNo = retrievedCookies.MobileNo;
    // console.log(retrievedCookies);
    this.loadForm();
  }

}
