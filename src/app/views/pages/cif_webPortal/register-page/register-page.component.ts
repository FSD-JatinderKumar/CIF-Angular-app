import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from "simple-datatables";
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone:false
})
export class RegisterPageComponent implements OnInit {
  emailId: any = '';  candidateName: any; supervisorName: any;mobileNumber: any;     instituteName: any;
  departmentName: any;     idProofType: any ='select' ;idProofNumber: any; address: any;   password: any;  confirmPassword: any; userRole: any ='select';
  cifUserForm!: FormGroup;
  isForm1Submitted: boolean = false;
  IdProofFileName: string | null = null;
  IdProofFile: string | null = null;
  sessionData: any[] = [];

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm(): void {
    this.cifUserForm = this.fb.group({
      EmailId: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      CandidateName: ['', [Validators.required, Validators.maxLength(30)]],
      Supervisorname: ['', [Validators.required, Validators.maxLength(30)]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      InstituteName: ['', [Validators.required, Validators.maxLength(30)]],
      DepartmentName: ['', [Validators.required, Validators.maxLength(30)]],
      IdProofType: ['select', Validators.required],
      IdProofNumber: ['', [Validators.required, Validators.maxLength(15)]],
      Address: ['', [Validators.required, Validators.maxLength(150)]],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      ConfirmPassword: ['', [Validators.required, Validators.maxLength(15)]],
      UserRole: ['select', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  get form1() {
    return this.cifUserForm.controls;
  }

  Onsubmit(): void {
    this.isForm1Submitted = true;
    if (this.cifUserForm.valid) {
      const formData = new FormData();
      formData.append("UserEmail", this.emailId);
      formData.append("CandidateName", this.candidateName);
      formData.append("SupervisorName", this.supervisorName);
      formData.append("MobileNumber", this.mobileNumber);
      formData.append("SchoolName", this.instituteName);
      formData.append("DepartmentName", this.departmentName);
      formData.append("IdProofType", this.idProofType);
      formData.append("IdProofNumber", this.idProofNumber);
      formData.append("UserType", this.userRole);
      formData.append("Address", this.address);
      formData.append("PasswordText", this.password);
   

      var result;
  
    this.CIFwebService.NewUserRecord(formData).subscribe({
      next: (data) => {
        let result = data.item1[0]['msg'];
        let errorCode = data.item1[0]['returnId'];

        if (result === 'Success') {
          swal.fire({
            title: 'User Login Created Successfully',
            text: data.item1[0]['msg'],
            icon: 'success',
          }).then(() => {
            // After the success alert, navigate to the desired page
            this.router.navigate(['/Home']);
          });
        } else if (errorCode === -1) {
          swal.fire({
            title: 'User Already Exists',
            icon: 'error',
          }).then(() => {
            // Optionally reload the page to reset the form or clear inputs
            window.location.reload();
          });
        } else {
          swal.fire({
            title: 'Some Technical Issue',
            text: result,
            icon: 'error',
          }).then(() => {
            // Optionally reload the page to reset the form or clear inputs
            window.location.reload();
          });
        }
      },
      error: (err) => {
        // Handle any errors from the HTTP request
        swal.fire({
          title: 'Error Occurred',
          text: 'Unable to complete the request. Please try again later.',
          icon: 'error',
        });
      }
    });

    } else {
      this.cifUserForm.markAllAsTouched();
    }
  }

  OnReset(): void {
    this.cifUserForm.reset();
    this.isForm1Submitted = false;
  }
}
