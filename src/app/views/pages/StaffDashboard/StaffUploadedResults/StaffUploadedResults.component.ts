import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

@Component({
  selector: 'app-StaffUploadedResults',
  templateUrl: './StaffUploadedResults.component.html',
  styleUrls: ['./StaffActionBookings.component.scss']
})
export class StaffUploadedResultsComponent implements OnInit {
  @ViewChild('table') table: ElementRef;

  loadingIndicator = false;
  BookingData: any[] = [];
  tmpsBookingData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  NoResults: string = '';
  searchQuery: string = '';
  serverUrl: string;

  UserRole: any;
  UserId: any;
  EmployeeCode: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';
    const GetCookieData = this.cookieService.get('StaffUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.EmailId;
    this.EmployeeCode = retrievedCookies.UserId;
    this.getUploadedResultsDetails(this.EmployeeCode);
  }

  search(): void {
    const query = this.searchQuery.toLowerCase();
    this.tmpsBookingData = this.BookingData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      )
    );
  }

  getUploadedResultsDetails(UID: any): void {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();

    this.CIFwebService.GetUploadedResultDetails(UID).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.BookingData = response.item1;
          const firstRecord = response.item1[0];
          this.NoResults = firstRecord.returnMessage || '';

          this.tmpsBookingData = [...this.BookingData];
        } else {
          this.BookingData = [];
          this.tmpsBookingData = [];
          this.NoResults = 'No Details';
        }

        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(2500 - elapsed, 0);

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.error(err);
        this.loadingIndicator = false;
      }
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.tmpsBookingData.length / this.itemsPerPage);
  }

  getCurrentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsBookingData.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportToExcel(): void {
    const fileName = 'AssignedResults_report.xlsx';
    const exportedData = this.BookingData.map(item => ({
      EmailId: item.userEmailId,
      BookingId: item.bookingId,
      Instrument: item.instrumentName,
      Charges: item.totalCharges,
      BookingDate: item.allocatedOn,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);
    ws['!cols'] = [
      { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const blobData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blobData], { type: 'application/octet-stream' }));
    link.download = fileName;
    link.click();
  }

  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
  }
}

// import { FormBuilder } from '@angular/forms';
// import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/_services/auth.service';
// import { StorageService } from 'src/app/_services/storage.service';
// import * as XLSX from 'xlsx';
// import swal from 'sweetalert2';
// import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
// import Swal from 'sweetalert2';
// import { LoginSessionService } from 'src/app/_services/login-session.service';

// import { ColumnMode } from '@swimlane/ngx-datatable';

// import { MatTableDataSource } from '@angular/material/table';
// import { NgSelectComponent } from '@ng-select/ng-select';
// import { DOCUMENT } from '@angular/common';


// @Component({
//   selector: 'app-StaffUploadedResults',
//   templateUrl: './StaffUploadedResults.component.html',
//   styleUrls: ['./StaffActionBookings.component.scss']
// })
// export class StaffUploadedResultsComponent implements OnInit {
//   @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
//   @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
//   @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
//   @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
//   @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
//   dataSource: MatTableDataSource<any>;

//   FileData: any; array: any[] = []; fileData: File; fileStatus: boolean = false;
//   fileName: string;
//   selectedId: number;
//   ColumnMode = ColumnMode;
//   columns: any;
//   loadingIndicator = false;
//   headHtmlData: any[] = [];
//   p: any = 1;
//   perPage: any = 5;
//   @ViewChild('table') table: ElementRef;
 
//   BookingCase: any;
//   BookingData: any;
//   currentPage = 1;
//   itemsPerPage = 10; //
//   tmpsBookingData: any;
//   InstrumentId: any;
//   UserRole: any;
//   UserId: any;
//   uploadEnabled: boolean;
//   Remarks: any;
//   serverUrl: string;

//   constructor(
//     private CIFwebService: LpuCIFWebService,
//     private modalService: NgbModal,
//     private AuthSession: LoginSessionService,
//     private cookieService: CookieService) { }
//   user_Email: any;
//   EmployeeCode: any;
//   sessionData: any[] = [];
//   getSessionDetails() {
//     this.sessionData = this.AuthSession.getSession();
//     for (const session of this.sessionData) {
//       this.user_Email = session[0]['userEmail']
//     }
//   }
//   ngOnInit(): void {
//     this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';//'http://172.19.2.52/umsweb/webftp/MOUDocuments/'; = 'https://files.lpu.in/umsweb/CIFDocuments/'
//     const GetCookieData = this.cookieService.get('StaffUserAuthData');
//     const retrievedCookies = JSON.parse(GetCookieData);
//     this.UserRole = retrievedCookies.UserRole;
//     this.UserId = retrievedCookies.EmailId;
//     this.EmployeeCode = retrievedCookies.UserId;
//     this.getUploadedResultsDetails(this.EmployeeCode);

//   }

//   searchQuery: string = '';

//   search() {
//     const query = this.searchQuery.toLowerCase();
//     this.tmpsBookingData = this.BookingData.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
//       return Object.values(item).some(val =>
//         String(val).toLowerCase().includes(query)
//       );
//     });
//   }


//   get filteredBookingData(): any[] {
//     if (!this.searchQuery.trim()) {
//       return this.BookingData;
//     }
//     const searchTerm = this.searchQuery.toLowerCase();
//     return this.BookingData.filter((booking: { instrumentName: string; analysisType: string; }) =>
//       booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)
//     );
//   }
//   NoResults: any = '';
//   getUploadedResultsDetails(UID: any) {
//     this.loadingIndicator = true;
//     const startTime = new Date().getTime();
    
//     this.CIFwebService.GetUploadedResultDetails(UID).subscribe({
//       next: response => {
//         if (response.item1 && response.item1.length > 0) {
//           this.BookingData = response.item1;
//           const firstRecord = response.item1[0];
//           this.NoResults = firstRecord.returnMessage;
  
//           this.dataSource = response.item1;
//           this.tmpsBookingData = response.item1;
//           this.headHtmlData = this.tmpsBookingData[0];
//           this.columns = Object.keys(this.tmpsBookingData[0]);
//           this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
//           this.columns.push(); // Ensure this line has a valid value if needed
//         } else {
//           this.BookingData = [];
//         }
  
//         const elapsed = new Date().getTime() - startTime;
//         const remainingDelay = Math.max(2500 - elapsed, 0); // wait at least 1.5s
  
//         setTimeout(() => {
//           this.loadingIndicator = false; // Set loadingIndicator to false after the delay
//         }, remainingDelay);
//       },
//       error: err => {
//         console.log(err);
//         this.loadingIndicator = false; // Ensure loadingIndicator is also set to false on error
//       }
//     });
//   }
  
//   getTotalPages() {
//     return Math.ceil(this.tmpsBookingData.length / this.itemsPerPage);
//   }

//   getCurrentPageData() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     return this.tmpsBookingData.slice(startIndex, endIndex);
//   }

//   nextPage() {
//     if (this.currentPage < this.getTotalPages()) {
//       this.currentPage++;
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   exportToExcel(): void {
//     const fileName = 'AssignedResults_report.xlsx';
//     const exportedData = this.BookingData.map((item: { userEmailId: any; bookingId: any; instrumentName: any; totalCharges: any; allocatedOn: any; }) => ({
//       EmailId: item.userEmailId,
//       BookingId: item.bookingId,
//       Instrument: item.instrumentName,
//       Charges: item.totalCharges,
//       BookingDate: item.allocatedOn,
//     }));

//     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

//     const wscols = [
//       { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }
//     ];
//     ws['!cols'] = wscols;

//     const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const blobData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(new Blob([blobData], { type: 'application/octet-stream' }));
//     link.download = fileName;
//     link.click();
//   }


//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

//   downloadFile(fileName: string): void {
//     const url = this.serverUrl + fileName;
//     window.open(url, '_blank');
//   }
 

 
// }
