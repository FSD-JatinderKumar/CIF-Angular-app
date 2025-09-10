import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-CifLoginPage',
  templateUrl: './CifLoginPage.component.html',
  styleUrls: ['./CifLoginPage.component.scss'],
  standalone: false
})
export class CifLoginPageComponent implements OnInit {
  registrationNumber: any; EmployeeDetails: any[] = []; regdId: any; DriveDropDown: any; showNoDataFoundMessage: boolean; UserData: any;
  EmployeeName: any; EmployeeCode: any; Department: any; DepartmentName: any; loadingIndicator: boolean; CandidateName: any;
  UserId: any; Designation: any; EmailId: any; MobileNo: any; UserRole: any; SupervisorName: any; ProofNumber: any; ProofName: any; SecretKey: any;
  Email: any;
  formdata!: FormGroup;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private AuthSession: LoginSessionService,
    private router: Router,
    private cookieService: CookieService  ) { }

  ngOnInit(): void {
    this.cookieService.delete('InternalUserAuthData');
    this.AuthSession.clearSession();
    this.loadForm();
  }

  submitted = false;
  showPassword = false;
  loginError: string | null = null;
  isLoginFailed = false;

  loadForm(): void {
    this.formdata = this.fb.group({
      Email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      UserRoleS: ['', Validators.required],
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

  get userRole(): AbstractControl | null {
    return this.formdata.get('UserRoleS');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  CheckUserType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue === 'select' || selectedValue == '') {
      console.warn('Please select a valid role.');
    } else {
      // console.log('Valid Role Selected:', selectedValue);
    }
  }
  OnSubmit() {
    this.submitted = true;

    if (this.formdata.invalid) {
      this.formdata.markAllAsTouched();
      return;
    }
    var DataX = this.formdata.value;
    var uid = DataX.Email ?? '';
    var password = DataX.password ?? '';
    var userRoleX: number | null = null;
    if (DataX.UserRoleS !== null && DataX.UserRoleS !== undefined) {
      userRoleX = parseInt(DataX.UserRoleS as string);
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

  AuthoriseUserNewWay(Id: any, Key: any, Role: any): void {
    this.CIFwebService.GetAuthoriseUserData(Id, Key, Role).subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.Email = response.item1[0].email;
          this.CreateToken(this.Email, response);

          this.formdata.reset();
          this.submitted = false;
          this.loginError = null;
          this.isLoginFailed = false;
        } else {
          this.showNoDataFoundMessage = true;
          this.loginError = 'Invalid login details. Please try again.';
          this.isLoginFailed = true;

          swal.fire({
            title: 'Invalid Login Details',
            text: 'Check Details!',
            icon: 'warning',
          });
          this.formdata.reset();
          this.formdata.patchValue({
            UserRoleS: '', // Reset to default "Select Role" placeholder
          });
          this.submitted = false;
        }
      },
      error: (err) => {
        console.error(err);

        this.loginError = 'An error occurred while processing your request.';
        this.isLoginFailed = true;

        if (err.status === 0) {
          swal.fire({
            title: 'Server Down',
            text: 'The server is currently unavailable. Please try again later.',
            icon: 'error',
          });
        } else {
          swal.fire({
            title: 'Error',
            text: this.loginError,
            icon: 'error',
          });
        }

        // ✅ Reset form on API error as well
        this.formdata.reset();
        this.formdata.patchValue({
          UserRoleS: '', // Reset to default "Select Role" placeholder
        });
        this.submitted = false;
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
      error: () => {
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
      ProofNumber: this.ProofNumber,
      ProofName: this.ProofName,
      PasswordText: this.SecretKey,
    };
    const UserCookies = JSON.stringify(userCookiesData);
    this.cookieService.set('InternalUserAuthData', UserCookies);

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
      <p style="margin-bottom: 8px;">•    We agree to acknowledge CIF, LPU in our publications and thesis if the results from CIF instrumentation are incorporated/used in them. </p>
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

        this.router.navigateByUrl('/UserProfiles').then(() => {
          window.location.reload();
        });
        // this.router.navigateByUrl('/NewBookings').then(() => {
        //   window.location.reload();
        // });
      } else {
        swal.fire({
          title: 'Agreement Required',
          text: 'You must agree to proceed further.',
          icon: 'warning',
        }).then(() => {
          this.LogoutUser(); 
        });
      }
    });

  }
  openSampleInstructions() {
    swal.fire({
      title: 'Send Samples at Following Address :',
      html: `
           <address>
            <div class="contact-text">
            Central Instrumentation Facility (CIF) <br/>
            Lovely Professional University <br/>
            Block-38, Room No.106 <br/>
            Jalandhar - Delhi G.T. Road, <br/>
             Phagwara, Punjab (India) - 144411 <br/>
            <a href="tel:+911824444021">+91 1824-444021</a><br>
            cif@lpu.co.in<br>
            </div>
           </address>`,
      icon: 'info'
    });


  }
  LogoutUser() {
    this.cookieService.delete('InternalUserAuthData');
    this.AuthSession.clearSession(); // if you have a method like this
    this.router.navigateByUrl('/Login'); // adjust to your login path
  }


}