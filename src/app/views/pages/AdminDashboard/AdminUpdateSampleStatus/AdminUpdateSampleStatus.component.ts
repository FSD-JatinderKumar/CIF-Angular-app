import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-AdminUpdateSampleStatus',
  templateUrl: './AdminUpdateSampleStatus.component.html',
  styleUrls: ['./AdminUpdateSampleStatus.component.css']
})
export class AdminUpdateSampleStatusComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild('ViewUpdateStatusModal') ViewUpdateStatusModal: TemplateRef<any>;

  loadingIndicator = false;
  AllBookingTestsData: any[] = [];
  filteredBookingTestsData: any[] = [];
  AllStatusData: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;

  searchQuery = '';
  BookingCase: any;
  AssignedTo = '';
  ReceivedDate: string;

  user_Email: string;
  UserRole: string;
  candidateName: string;
  serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

  private modalRef: NgbModalRef;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingIndicator = true; 
    this.loadUserData();
    this.fetchAllBookingTests();
    this.fetchAllSampleStatus();
  }

  private loadUserData(): void {
    const cookieData = this.cookieService.get('authData');
    if (!cookieData) {
      this.handleUnauthorized();
      return;
    }
    const parsed = JSON.parse(cookieData);
    this.UserRole = parsed.UserRole;
    this.user_Email = parsed.EmailId;
    this.candidateName = parsed.CandidateName;
  }

  private handleUnauthorized(): void {
    swal.fire({ title: 'Login Failed', icon: 'warning' });
    this.router.navigate(['/Home']);
  }

  fetchAllBookingTests(): void {
    this.loadingIndicator = true;
    const startTime = Date.now();
  
    this.CIFwebService.GetAllBookingTests().subscribe({
      next: (response) => {
        this.AllBookingTestsData = (response.item1 || []).filter((item: { bookingId: any; }) => item && item.bookingId);
        this.filteredBookingTestsData = [...this.AllBookingTestsData];
  
        const elapsed = Date.now() - startTime;
        const remaining = 2500 - elapsed;
  
        if (remaining > 0) {
          setTimeout(() => {
            this.loadingIndicator = false;
          }, remaining);
        } else {
          this.loadingIndicator = false;
        }
      },
      error: (err) => {
        console.error(err);
        this.AllBookingTestsData = [];
        this.filteredBookingTestsData = [];
  
        const elapsed = Date.now() - startTime;
        const remaining = 2500 - elapsed;
  
        if (remaining > 0) {
          setTimeout(() => {
            this.loadingIndicator = false;
          }, remaining);
        } else {
          this.loadingIndicator = false;
        }
      }
    });
  }
  

  fetchAllSampleStatus(): void {
    this.CIFwebService.GetAllSampleStatus().subscribe({
      next: (response) => {
        this.AllStatusData = response.item1 || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  isStatusDisabled(bookingId: string, instrumentId: string): boolean {
    return this.AllStatusData.some(
      status =>
        String(status.bookingId) === String(bookingId) &&
        String(status.instrumentId) === String(instrumentId)
    );
  }

  search(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredBookingTestsData = [...this.AllBookingTestsData];
    } else {
      this.filteredBookingTestsData = this.AllBookingTestsData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }
    this.currentPage = 1;
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredBookingTestsData.length / this.itemsPerPage) || 1;
  }

  getCurrentPageData(): any[] {
    if (!this.filteredBookingTestsData) return [];
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBookingTestsData.slice(start, start + this.itemsPerPage);
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
    if (!this.AllBookingTestsData.length) return;

    const exportData = this.AllBookingTestsData.map(item => ({
      EmailId: item.userEmailId,
      CandidateName: item.candidateName,
      Instrument: item.instrumentName,
      SampleCount: item.noOfSamples,
      BookingDate: item.bookingRequestDate,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = Array(5).fill({ wpx: 180 });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Assigned_Details_report.xlsx');
  }

  openUpdateStatusModal(booking: any): void {
    this.BookingCase = booking;
    this.AssignedTo = '';
    this.ReceivedDate = '';
    this.modalRef = this.modalService.open(this.ViewUpdateStatusModal, { size: 'sm' });
  }

  onActivitySelected(event: any): void {
    this.AssignedTo = event.target.value;
  }

  verifyData(): void {
    if (!this.ReceivedDate || !this.AssignedTo) return;

    this.loadingIndicator = true;
    const startTime = Date.now();

    const formData = new FormData();
    formData.append('BookingId', this.BookingCase.bookingId);
    formData.append('InstrumentId', this.BookingCase.instrumentId);
    formData.append('SampleSendBy', this.BookingCase.userEmailId);
    formData.append('ReceivedByUID', this.user_Email);
    formData.append('SampleCondition', this.AssignedTo);
    formData.append('ReceivedOn', this.ReceivedDate);

    this.CIFwebService.NewSAmpleStatus(formData).subscribe({
      next: (response: any) => {
        const validResponse = response && Array.isArray(response.item1) && response.item1.length > 0;
        if (!validResponse) {
          this.showAlert('Something went wrong', 'Unexpected server response. Please try again.', 'error');
          this.loadingIndicator = false;
          this.modalRef.close();
          // this.modalRef = null;
          this.cdRef.detectChanges();
          return;
        }

        const message = response.item1[0]?.msg;
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0);
        setTimeout(() => {
          this.loadingIndicator = false;
        
          // Close modal regardless of message
          if (this.modalRef) {
            this.modalRef.close();
            // this.modalRef = null;
            this.cdRef.detectChanges();
          }
        
          switch (message) {
            case 'Success':
              this.showAlert('Sample Status Updated!', '', 'success', true);
              break;
            case 'Failed':
              this.showAlert('Test is already assigned', 'You cannot assign it again.', 'warning');
              break;
            default:
              this.showAlert('Status already updated', 'No further action is required.', 'info');
              break;
          }
        }, remainingDelay);
        
        // setTimeout(() => {
        //   this.loadingIndicator = false;
        //   switch (message) {
        //     case 'Success':
        //       if (this.modalRef) {
        //         this.modalRef.close();
        //         // this.modalRef = null;
        //         this.cdRef.detectChanges();
        //       }
        //       this.showAlert('Sample Status Updated!', '', 'success', true);
        //       break;
        //     case 'Failed':
        //       this.showAlert('Test is already assigned', 'You cannot assign it again.', 'warning');
        //       break;
        //     default:
        //       this.showAlert('Status already updated', 'No further action is required.', 'info');
        //       break;
        //   }
        // }, remainingDelay);
      },
      error: (err) => {
        console.error('VerifyData API Error:', err);
        this.showAlert('Upload Failed', 'A server error occurred. Please try again later.', 'error');
        this.loadingIndicator = false;
      }
    });
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', reload: boolean = false): void {
    swal.fire({ title, text, icon }).then(() => {
      if (reload) {
        this.fetchAllBookingTests();
      }
    });
  }

  trackByBookingId(index: number, item: any): any {
    return item?.bookingId ?? index;
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
// import { LoginSessionService } from 'src/app/_services/login-session.service';

// import { ColumnMode } from '@swimlane/ngx-datatable';

// import { MatTableDataSource } from '@angular/material/table';
// import { NgSelectComponent } from '@ng-select/ng-select';
// import { DOCUMENT } from '@angular/common';

// @Component({
//   selector: 'app-AdminUpdateSampleStatus',
//   templateUrl: './AdminUpdateSampleStatus.component.html',
//   styleUrls: ['./AdminUpdateSampleStatus.component.css']
// })
// export class AdminUpdateSampleStatusComponent implements OnInit {
//   @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
//   @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
//   @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
//   @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
//   @ViewChild('ViewUpdateStatusModal') ViewUpdateStatusModal: TemplateRef<any>;
//   dataSource: MatTableDataSource<any>;


//   selectedId: number;
//   ColumnMode = ColumnMode;
//   columns: any;
//   loadingIndicator = false;
//   headHtmlData: any[] = [];
//   p: any = 1;
//   perPage: any = 5;
//   @ViewChild('table') table: ElementRef;
//   displayedColumns: string[] = [
//     'instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples',
//     'totalCharges', 'remarks', 'bookingRequestDate', //'bookingrequestDate'
//   ];
//   BookingCase: any;
//   AllBookingTestsData: any[] = [];

//   currentPage = 1;
//   itemsPerPage = 10; //
//   tmpsAllBookingTestsData: any[] = [];
//   InstrumentId: any;
//   UserRole: any;
//   AssignedTo: any = '';
//   serverUrl: string;
//   candidateName: any;
//   user_Email: any;
//   sessionData: any[] = [];

//   constructor(
//     private CIFwebService: LpuCIFWebService,
//     private storageService: StorageService,
//     private authService: AuthService,
//     private fb: FormBuilder, private cdRef: ChangeDetectorRef,
//     @Inject(DOCUMENT) document: Document,
//     private modalService: NgbModal,
//     private AuthSession: LoginSessionService,
//     private router: Router, private route: ActivatedRoute,
//     private cookieService: CookieService) { }

//   getSessionDetails() {
//     this.sessionData = this.AuthSession.getSession();
//     for (const session of this.sessionData) {
//       this.user_Email = session[0]['userEmail']
//     }
//   }
//   disabledStatusSet: Set<string>;


//   ngOnInit(): void {
//     const GetCookieData = this.cookieService.get('authData');
//     const retrievedCookies = JSON.parse(GetCookieData);
//     this.UserRole = retrievedCookies.UserRole;
//     this.user_Email = retrievedCookies.EmailId;
//     this.candidateName = retrievedCookies.CandidateName;
//     this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
//     this.getAllBookigsDetails();
//     this.GetAllSampleStatus();
//     this.disabledStatusSet = new Set(
//       this.AllStatusData.map((status: { instrumentId: any; bookingId: any; }) => `${status.instrumentId}-${status.bookingId}`)
//     );
//   }
 
// // Utility function to check if booking exists in status data
// isStatusDisabled(bookingId: string, instrumentId: string): boolean {
//   return this.AllStatusData.some(
//     (    status: { bookingId: any; instrumentId: any; }) => 
//       String(status.bookingId) === String(bookingId) && 
//       String(status.instrumentId) === String(instrumentId)
//   );
// }
//   searchQuery: string = '';

//   getfilteredAllBookingTestsData(): any[] {
//     // If search query is empty, return all data
//     if (!this.searchQuery.trim()) {
//       return this.AllBookingTestsData;
//     }
//     const searchTerm = this.searchQuery.toLowerCase();
//     return this.AllBookingTestsData.filter((booking: { instrumentName: string; analysisType: string; }) =>
//       booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)
//     );
//   }

//   search() {
//     const query = this.searchQuery.toLowerCase();
//     this.tmpsAllBookingTestsData = this.AllBookingTestsData.filter(item => {
//       return Object.values(item).some(val =>
//         String(val).toLowerCase().includes(query)
//       );
//     });
//   }
//   getAllBookigsDetails() {
//     this.loadingIndicator = true; 
//     const startTime = new Date().getTime();
//     this.CIFwebService.GetAllBookingTests().subscribe({
//       next: response => {
//         if (response.item1 && response.item1.length > 0) {
//           this.AllBookingTestsData = response.item1;
//           // console.log(this.AllBookingTestsData)
//           this.dataSource = response.item1;
//           this.tmpsAllBookingTestsData = response.item1;
//           this.headHtmlData = this.tmpsAllBookingTestsData[0];
//           this.columns = Object.keys(this.tmpsAllBookingTestsData[0]);
//           this.columns.push()
          
//         }
//         else {
//           this.AllBookingTestsData = [];
//         }
//         const elapsed = new Date().getTime() - startTime;
//         const remainingDelay = Math.max(5000 - elapsed, 0); // wait at least 5s

//         setTimeout(() => {
//           this.loadingIndicator = false;
//         }, remainingDelay);
//       },
//       error: err => {
//         console.log(err)
//       }
//     });
//   }

//   // Calculate total pages based on the number of items and items per page
//   getTotalPages() {
//     return Math.ceil(this.tmpsAllBookingTestsData.length / this.itemsPerPage);
//   }

//   // Function to get the current page of data
//   getCurrentPageData() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     return this.tmpsAllBookingTestsData.slice(startIndex, endIndex);
//   }

//   // Function to go to the next page
//   nextPage() {
//     if (this.currentPage < this.getTotalPages()) {
//       this.currentPage++;
//     }
//   }

//   // Function to go to the previous page
//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }
//   exportToExcel(): void {
//     const fileName = 'Assigned_Details_report.xlsx';
//     const exportedData = this.AllBookingTestsData.map(item => ({
//       EmailId: item.userEmailId,
//       CanidateName: item.candidateName,
//       Instrument: item.instrumentName,
//       SampleCount: item.noOfSamples,
//       BookingDate: item.bookingRequestDate,
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


//   openUpdateStatusModal(a: any) {
//     this.BookingCase = a;
//     this.modalService.open(this.ViewUpdateStatusModal, { size: 'sm' }).result.then(
//       (result: string) => {
//         console.log("Modal closed" + result);
//       }
//     ).catch((res: any) => { });

//   }

//   onActivitySelected(event: any): void {
//     this.AssignedTo = event.target.value;
//   }
//   ReceivedDate: any;


//   VerifyData(AssignTest: any): void {
//     loadingIndicator: true;
//     const startTime = new Date().getTime();
//     const formData = new FormData();
//     formData.append('BookingId', AssignTest.bookingId);
//     formData.append('InstrumentId', AssignTest.instrumentId);
//     formData.append('SampleSendBy', AssignTest.userEmailId);
//     formData.append('ReceivedByUID', this.user_Email);
//     formData.append('SampleCondition', this.AssignedTo);
//     formData.append('ReceivedOn', this.ReceivedDate);
  
//     this.CIFwebService.NewSAmpleStatus(formData).subscribe({
//       next: (response: any) => {
//         // console.log('VerifyData Response:', response);
  
//         // Validate response structure
//         const isValidResponse = response && Array.isArray(response.item1) && response.item1.length > 0;
//         if (!isValidResponse) {
//           this.showAlert('Something went wrong', 'Unexpected server response. Please try again.', 'error', true);
//           return;
//         }
  
//         const message = response.item1[0]?.msg;
//         const elapsed = new Date().getTime() - startTime;
//         const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

//         setTimeout(() => {
//           this.loadingIndicator = false;
//         }, remainingDelay);
//         switch (message) {
//           case 'Success':
//             this.showAlert('Sample Status Updated!', '', 'success', true);
//             break;
  
//           case 'Failed':
//             this.showAlert('Test is already assigned', 'You cannot assign it again.', 'warning', true);
//             break;
  
//           default:
//             this.showAlert('Status already updated', 'No further action is required.', 'info', true);
//             break;
//         }
        
//       },
//       error: (err: any) => {
//         console.error('VerifyData API Error:', err);
//         this.showAlert('Upload Failed', 'A server error occurred. Please try again later.', 'error');
//       }
//     });
//   }
  
//   /**
//    * Utility method to show SweetAlert messages.
//    * @param title Alert title
//    * @param text Optional alert body
//    * @param icon SweetAlert icon ('success' | 'error' | 'warning' | 'info')
//    * @param reload Whether to reload the page after confirmation
//    */
//   private showAlert(title: string, text: string = '', icon: 'success' | 'error' | 'warning' | 'info', reload: boolean = false): void {
//     swal.fire({ title, text, icon }).then(() => {
//       if (reload) {
//         window.location.reload();
//       }
//     });
//   }
//   downloadFile(fileName: string): void {
//     const url = this.serverUrl + fileName;
//     window.open(url, '_blank');
//   }
//   AllStatusData: any;
//   GetAllSampleStatus(){
//     this.CIFwebService.GetAllSampleStatus().subscribe({
//       next: response => {
//         if (response.item1 && response.item1.length > 0) {
//           this.AllStatusData = response.item1;
//           // console.log(JSON.stringify(this.AllStatusData))
//         }
//         else {
//           this.AllStatusData = [];
//         }
//       },
//       error: err => {
//         console.log(err)
//       }
//     });
//   }

//   CheckUserStatus(){

//      const GetCookieData = this.cookieService.get('authData');
//     if (GetCookieData.length == 0) {
//       swal.fire({
//         title: 'Login Failed ',
//         icon: 'warning',
//       });
//      this.router.navigate(['/Home']);
//     }
//   }
// }