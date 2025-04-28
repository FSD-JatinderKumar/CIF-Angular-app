import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UntypedFormBuilder} from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

@Component({
  selector: 'app-FacultyDashboard',
  templateUrl: './FacultyDashboard.component.html',
  styleUrls: ['./FacultyDashboard.component.scss']
})
export class FacultyDashboardComponent implements OnInit {

  UserSessionData: any;
  UserRole: any;
  user_Email: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any; isNavbarCollapsed: boolean = true;
  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) {

    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData.length == 0) {
      swal.fire({
        title: 'Login Failed ',
        icon: 'warning',
      });
      this.router.navigate(['/cifWebPortal']);
    }
  }

  goto(val: any) {
    this.router.navigateByUrl(val);
  }
  ngOnInit(): void {
    const GetCookieData = this.cookieService.get('authData');
    // console.log("User Details = " + GetCookieData); // Already a string, no need to stringify

    const retrievedCookies = JSON.parse(GetCookieData);

    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.user_Email = retrievedCookies.EmailId;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;

  }


}
