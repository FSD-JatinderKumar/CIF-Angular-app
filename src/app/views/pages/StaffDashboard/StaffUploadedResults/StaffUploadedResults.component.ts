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
