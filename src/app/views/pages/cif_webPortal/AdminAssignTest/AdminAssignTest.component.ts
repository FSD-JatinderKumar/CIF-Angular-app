import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';

import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-AdminAssignTest',
  templateUrl: './AdminAssignTest.component.html',
  styleUrls: ['./AdminAssignTest.component.scss']
})
export class AdminAssignTestComponent implements OnInit {

  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  @ViewChild('table') table: ElementRef;

  displayedColumns: string[] = ['instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples', 'totalCharges', 'remarks', 'bookingRequestDate'];
  dataSource: MatTableDataSource<any>;

  AllBookingTestsData: any[] = [];
  tmpsAllBookingTestsData: any[] = [];
  headHtmlData: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  searchQuery: string = '';

  BookingCase: any;
  AssignedTo: any;
  InstrumentId: any;
  loadingIndicator = false;

  // User data from cookie
  UserRole: string = '';
  user_Email: string = '';
  candidateName: string = '';

  serverUrl: string = 'https://files.lpu.in/umsweb/MOUDocuments/';
  supervisorName: any;
  departmentName: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    @Inject(DOCUMENT) document: Document
  ) { }

  ngOnInit(): void {  
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      const retrievedCookies = JSON.parse(GetCookieData);
      this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
      this.user_Email = retrievedCookies.EmailId;
      this.supervisorName = retrievedCookies.SupervisorName;
      this.departmentName = retrievedCookies.DepartmentName;
      this.candidateName = retrievedCookies.CandidateName;
    } else {
       swal.fire({
        title: 'Login Failed ',
        icon: 'warning',
      });
      this.router.navigate(['/cifWebPortal']);
    }
    // this.loadUserFromCookies();
    this.getAllPaymentDetails();
    this.getAllAssignedTest();

  }

  loadUserFromCookies(): void {
    const cookieData = this.cookieService.get('authData');

    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        this.UserRole = parsed.UserRole || '';
        this.user_Email = parsed.EmailId || '';
        this.candidateName = parsed.CandidateName || '';
      } catch (err) {
        console.error('Error parsing authData cookie:', err);
        swal.fire('Session Error', 'Invalid session data. Please login again.', 'error');
        this.router.navigate(['/login']);
      }
    } else {
      swal.fire('Session Expired', 'Please login again to continue.', 'warning');
      this.router.navigate(['/login']);
    }
  }

  get filteredAllBookingTestsData(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.AllBookingTestsData;

    return this.AllBookingTestsData.filter((booking) =>
      booking.instrumentName.toLowerCase().includes(query) ||
      booking.analysisType.toLowerCase().includes(query)
    );
  }

  getAllPaymentDetails(): void {
    this.loadingIndicator=true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllBookingTests().subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.AllBookingTestsData = response.item1;
          this.dataSource = new MatTableDataSource(response.item1);
          this.tmpsAllBookingTestsData = response.item1;
          this.headHtmlData = response.item1[0];
        } else {
          this.AllBookingTestsData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: (err) => {
        console.error('Failed to load booking tests:', err);
      }
    });
  }
  AllAssignedTest: any;
  getAllAssignedTest(): void {
    this.CIFwebService.GetAllUploadedResultsByStaff().subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.AllAssignedTest = response.item1;
          // console.log("ASSIGNED"+JSON.stringify(this.AllAssignedTest));
        } else {
          this.AllAssignedTest = [];
        }
      },
      error: (err) => {
        console.error('Failed to load booking tests:', err);
      }
    });
  }

  assignedTests: any[] = []; // This should be filled from your assigned tests API

isAlreadyAssigned(row: any): boolean {
  return this.assignedTests.some(test =>
    test.bookingId === row.bookingId &&
    test.instrumentId === row.instrumentId &&
    test.returnMessage !== 'No Details'
  );
}
  getTotalPages(): number {
    return Math.ceil(this.tmpsAllBookingTestsData.length / this.itemsPerPage);
  }

  getCurrentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tmpsAllBookingTestsData.slice(startIndex, startIndex + this.itemsPerPage);
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
    const exportedData = this.AllBookingTestsData.map(item => ({
      EmailId: item.userEmailId,
      CandidateName: item.candidateName,
      Instrument: item.instrumentName,
      SampleCount: item.noOfSamples,
      BookingDate: item.bookingRequestDate,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);
    ws['!cols'] = Array(5).fill({ wpx: 180 });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const blobData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blobData], { type: 'application/octet-stream' }));
    link.download = 'Assigned_Details_report.xlsx';
    link.click();
  }

  openPaymentModal(item: any): void {
    this.BookingCase = item;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result
      .then((result: string) => console.log('Modal closed:', result))
      .catch(() => { });
  }

  onActivitySelected(event: any): void {
    this.AssignedTo = event.target.value;
  }
  VerifyData(AssignTest: any): void {
    const formData = new FormData();
    formData.append('BookingId', AssignTest.bookingId);
    formData.append('InstrumentId', AssignTest.instrumentId);
    formData.append('UserId', AssignTest.userEmailId);
    formData.append('AssignedTo', this.AssignedTo);
  
    this.CIFwebService.CIFAssignTestToStaff(formData).subscribe({
      next: (data: any) => {
        const result = data.item1?.[0]?.msg || '';
  
        // Define allowed keys
        const alertMap: Record<'Success' | 'Failed' | 'Default', { title: string; icon: any }> = {
          Success: { title: 'Action Planned Stored Successfully!', icon: 'success' },
          Failed: { title: 'Test is already Assigned', icon: 'error' },
          Default: { title: 'Something Went Wrong, Try again later', icon: 'error' }
        };
  
        // If result is not a valid key, fall back to 'Default'
        const alert = alertMap[result as keyof typeof alertMap] || alertMap.Default;
  
        swal.fire({ title: alert.title, icon: alert.icon }).then(() => window.location.reload());
      },
      error: () => {
        swal.fire({
          title: 'Error',
          text: 'Failed to Upload.',
          icon: 'error'
        }).then(() => window.location.reload());
      }
    });
  }
  
  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsAllBookingTestsData = this.AllBookingTestsData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}