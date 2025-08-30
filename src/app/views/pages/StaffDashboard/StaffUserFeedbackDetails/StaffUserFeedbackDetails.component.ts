import { UntypedFormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';


@Component({
  selector: 'app-StaffUserFeedbackDetails',
  templateUrl: './StaffUserFeedbackDetails.component.html',
  styleUrls: ['./StaffUserFeedbackDetails.component.css']
})
export class StaffUserFeedbackDetailsComponent implements OnInit {

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
    public formBuilder: UntypedFormBuilder,
    private router: Router, private cookieService: CookieService
  ) {

  }

  goto(val: any) {
    this.router.navigateByUrl(val);
  }
  ngOnInit(): void {
    const GetCookieData = this.cookieService.get('StaffUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.GetAllFeedbackData();

  }
  AllFeedbackData: any;
  GetAllFeedbackData(){
    this.showLoader = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllFeedbackdetails().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.AllFeedbackData =  this.tmpsAllFeedbackData =response.item1;
        }
        else {
          this.AllFeedbackData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.showLoader = false;
        }, remainingDelay);
      },
      error: err => {
        this.showLoader = false;
        console.error('Error loading feedback:', err);
      }
    });
  }
  BookingCase: any;
 
  currentPage = 1;
  itemsPerPage = 10; // 
  tmpsAllFeedbackData: any[]=[];
  InstrumentId: any;
  UserId: any;
  uploadEnabled: boolean;
  Remarks: any;
  
  getTotalPages() {
    return Math.ceil(this.tmpsAllFeedbackData.length / this.itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsAllFeedbackData.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  

    
  exportToExcel(): void {
    const fileName = 'User_Details_report.xlsx';
    const exportedData = this.AllFeedbackData.map((item: { emailId: any; candidateName: any; mobileNumber: any; departmentName: any; organisation: any; supervisorName: any; designation: null; userRole: string | null; }) => ({
      EmailId: item.emailId,
      CanidateName: item.candidateName,
      MobileNo: item.mobileNumber,
      Department: item.departmentName,
      SchoolName: item.organisation,
      SupervisorName: item.supervisorName,
      Designation: item.designation != null? item.designation:'NA',
      Role: item.userRole != null 
      ? item.userRole === '400000' 
        ? 'Internal User' 
        : item.userRole === '400001' 
          ? 'External Acadmeia' 
          : 'Industry User'
      : 'N-A',
       
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

    const wscols = [
      { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 200 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }
    ];
    ws['!cols'] = wscols;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const blobData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blobData], { type: 'application/octet-stream' }));
    link.download = fileName;
    link.click();
  }

  searchQuery: string = ''; // Property to store the search query

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsAllFeedbackData = this.AllFeedbackData.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }
  
  showLoader = true;
}
