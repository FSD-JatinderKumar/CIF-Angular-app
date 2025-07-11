import { FormBuilder } from '@angular/forms';
import {  ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-AdminUpdateSampleStatus',
  templateUrl: './AdminUpdateSampleStatus.component.html',
  styleUrls: ['./AdminUpdateSampleStatus.component.css']
})
export class AdminUpdateSampleStatusComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('ViewUpdateStatusModal') ViewUpdateStatusModal: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;


  selectedId: number;
  ColumnMode = ColumnMode;
  columns: any;
  loadingIndicator = false;
  headHtmlData: any[] = [];
  p: any = 1;
  perPage: any = 5;
  @ViewChild('table') table: ElementRef;
  displayedColumns: string[] = [
    'instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples',
    'totalCharges', 'remarks', 'bookingRequestDate', //'bookingrequestDate'
  ];
  BookingCase: any;
  AllBookingTestsData: any[] = [];

  currentPage = 1;
  itemsPerPage = 10; //
  tmpsAllBookingTestsData: any[] = [];
  InstrumentId: any;
  UserRole: any;
  AssignedTo: any = '';
  serverUrl: string;
  candidateName: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) { }
  user_Email: any;
  sessionData: any[] = [];
  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/MOUDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    // this.getSessionDetails();
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.getAllBookigsDetails()
  }

  searchQuery: string = '';  

  get filteredAllBookingTestsData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.AllBookingTestsData;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    return this.AllBookingTestsData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsAllBookingTestsData = this.AllBookingTestsData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }
  getAllBookigsDetails() {
    this.CIFwebService.GetAllBookingTests().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.AllBookingTestsData = response.item1;
          this.dataSource = response.item1;
          this.tmpsAllBookingTestsData = response.item1;
          this.headHtmlData = this.tmpsAllBookingTestsData[0];
          this.columns = Object.keys(this.tmpsAllBookingTestsData[0]);
          this.columns.push()
          this.loadingIndicator = false;
        }
        else {
          this.AllBookingTestsData = [];
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  // Calculate total pages based on the number of items and items per page
  getTotalPages() {
    return Math.ceil(this.tmpsAllBookingTestsData.length / this.itemsPerPage);
  }

  // Function to get the current page of data
  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsAllBookingTestsData.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Function to go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  exportToExcel(): void {
    const fileName = 'Assigned_Details_report.xlsx';
    const exportedData = this.AllBookingTestsData.map(item => ({
      EmailId: item.userEmailId,
      CanidateName: item.candidateName,
      Instrument: item.instrumentName,
      SampleCount: item.noOfSamples,
      BookingDate: item.bookingRequestDate,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

    const wscols = [
      { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openUpdateStatusModal(a: any) {
    this.BookingCase = a;
    this.modalService.open(this.ViewUpdateStatusModal, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  onActivitySelected(event: any): void {
    this.AssignedTo = event.target.value;
  }
  ReceivedDate: any;

  VerifyData(AssignTest: any) {
    const formData = new FormData();
    formData.append('BookingId', AssignTest.bookingId);
    formData.append('InstrumentId', AssignTest.instrumentId);
    formData.append('SampleSendBy', AssignTest.userEmailId);
    formData.append('ReceivedByUID', this.user_Email);
    formData.append('SampleCondition', this.AssignedTo);
    formData.append('ReceivedOn', this.ReceivedDate);

    this.CIFwebService.NewSAmpleStatus(formData).subscribe({
      next: (data: any) => {
        const result = data.item1[0]['msg'];
        if (result === 'Success') {
          swal.fire({
            title: 'Sample Status Updated!',
            // text: '',
            icon: 'success'
          }).then(() => {
            window.location.reload();
            // this.router.navigate(['/AssignTestCifA']);
          });
        } else if (result === 'Failed') {
          swal.fire({
            title: 'Test is already Assigned ',
            icon: 'error'
          }).then(() => {
            window.location.reload();
          });
        } else {
          swal.fire({
            title: 'Something Went Wrong, Try again later',
            icon: 'error'
          }).then(() => {
            window.location.reload();
            // this.router.navigate(['/AssignTestCifA']);
          });
        }
      },
      error: (error: any) => {
        swal.fire({
          title: 'Error',
          text: 'Failed to Upload.',
          icon: 'error'
        }).then(() => {
          // window.location.reload();
          // SampleStatus
          this.router.navigate(['/AssignTestCifA']);
        });
      },
      complete: () => {
      }
    });
  }
  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
  }
}