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
  selector: 'app-StaffUserlogin',
  templateUrl: './StaffUser-login.component.html',
  styleUrls: ['./StaffUser-login.component.scss']
})
export class StaffUserLoginComponent implements OnInit {
  formdata!: FormGroup;     submitted = false;    showPassword = false;   loginError: string | null = null;   isLoginFailed = false;  showNoDataFoundMessage = false;
  loadingIndicator = false;   storeResult = 0;    CandidateName: any;   UserId: any;    Department: any;    DepartmentName: any;    Designation: any;
  EmailId: any;   MobileNo: any;    UserRole: any;    SupervisorName: any;    SecretKey: any;   EmployeeDetails: any;   EmployeeName: any;    EmployeeCode: any;
  ErrMessage: any='';
  constructor(
    private fb: FormBuilder,      private authService: AuthService,     private storageService: StorageService,     private CIFwebService: LpuCIFWebService,
    private AuthSession: LoginSessionService,     private router: Router,     private route: ActivatedRoute,      private cookieService: CookieService,     private mouDocumentsService: MouDocumentsService,
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
    this.submitted = false;     this.loginError = null;
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
          const AllallowedIds = [
            { uid: '24374' },
            { uid: '20362' },
            { uid: '16477' },
            { uid: '27727' },
            { uid: '26918' },
            { uid: '30694' },
            { uid: '29159' },
            { uid: '31691' },
            { uid: '33476' },
            { uid: '31309' },
          ];

          const isAllowed = AllallowedIds.some(item => item.uid === this.EmployeeCode);

          if (!isAllowed) {
            this.isLoginFailed = true;
            this.ErrMessage = 'Not Authorised.  This Dashboard is only for CIF Staff Members!';               
          } else {


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
            this.isLoginFailed = false;
            this.AuthSession.addToSession(this.EmployeeDetails);

            const UserCookies = JSON.stringify(userCookiesData);
            // this.cookieService.set('StaffUserAuthData', UserCookies);
            const expirationMinutes = 25; // Set expiration time in minutes
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + expirationMinutes); // Set expiration time
            this.cookieService.set(
              'StaffUserAuthData',
              UserCookies,
              expirationDate, // Set the expiration date
              '/',           // Path
              undefined,     // Domain
              true,          // Secure: should be true in production
              'Lax'          // SameSite policy
            );
            this.router.navigate(['/StaffActionBookings']);
          }
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
    this.cookieService.delete('StaffUserAuthData');
    this.AuthSession.clearSession();
    this.isLoginFailed = true;
     this.ErrMessage = 'Login Failed. Invalid Details.';

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
