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
