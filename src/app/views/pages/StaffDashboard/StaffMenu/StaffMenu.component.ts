import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder} from '@angular/forms';
import swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

@Component({
  selector: 'app-StaffMenu',
  templateUrl: './StaffMenu.component.html',
  styleUrls: ['./StaffMenu.component.scss']
})
export class StaffMenuComponent implements OnInit {

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
    public formBuilder: UntypedFormBuilder,
    private AuthSession: LoginSessionService,
    private router: Router, private cookieService: CookieService
  ) {
    const GetCookieData = this.cookieService.get('StaffUserAuthData');
    if (GetCookieData.length == 0) {
      swal.fire({
        title: 'Login Failed',
        icon: 'warning',
      });
      this.router.navigate(['/login']);
    }
  }

  goto(val: any) {
    this.router.navigateByUrl(val);
  }
  ngOnInit(): void {
    const GetCookieData = this.cookieService.get('StaffUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.user_Email = retrievedCookies.EmailId;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;
  //  console.log(JSON.parse(GetCookieData));
  }

  // LogoutUser() {
  //   this.cookieService.delete('StaffUserAuthData');
  //   this.AuthSession.clearSession(); // if you have a method like this
  //   this.router.navigateByUrl('/login'); // adjust to your login path
  // }
  loadingIndicator: any;
  LogoutUser () {
    this.loadingIndicator = true;
  
    // Clear cookies and session immediately
    this.cookieService.delete('StaffUserAuthData');
    this.AuthSession.clearSession();
  
    // Wait 1 second before navigating (adjust delay as needed)
    setTimeout(() => {
      this.loadingIndicator = false;
      this.router.navigate(['Home'], { replaceUrl: true }).then(() => {        
        window.location.reload();
      });          
       
    }, 1000);
  }
}
