import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from "simple-datatables";
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { FormsModule } from '@angular/forms';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent implements OnInit {

  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
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
  BookingStatusData: any[] = [];
  ResultData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10; //
  tmpsBookingStatusData: any[] = [];
  tmpsResultData: any[] = [];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  Remarks: any;
  dataSource: any;
  ServerUrl: any;

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
    this.ServerUrl ='https://files.lpu.in/umsweb/MOUDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    if (GetCookieData) {
      const retrievedCookies = JSON.parse(GetCookieData);
      this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
      this.user_Email = retrievedCookies.EmailId;
    } else {
       swal.fire({
        title: 'Login Failed ',
        icon: 'warning',
      });
      this.router.navigate(['/cifWebPortal']);
    }

    this.getBookingDetails()
  }

  searchQuery: string = ''; // Property to store the search query

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsBookingStatusData = this.BookingStatusData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }


  get filteredBookingStatusData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.BookingStatusData;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    return this.BookingStatusData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }
  getBookingDetails() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetUserBookingStatus(this.user_Email).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.dataSource = this.BookingStatusData = this.tmpsBookingStatusData = response.item1;
          this.headHtmlData = this.tmpsBookingStatusData[0];
          this.columns = Object.keys(this.tmpsBookingStatusData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
          this.columns.push()

        }
        else {
          this.BookingStatusData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsBookingStatusData.length / this.itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsBookingStatusData.slice(startIndex, endIndex);
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
    const fileName = 'Booking_Details_report.xlsx';
    const exportedData = this.BookingStatusData.map(item => ({
      BookingId: item.bookingId,
      InstrumentName: item.instrumentName,
      AssignedTo: item.assignedTo.split(' ').slice(0, -1).join(' ') ,
      AssignedDate: item.assignedOn,
      Samples: item.noOfSamples,
      RequestDate: item.bookingRequestDate ,

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



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openPaymentModal(a: any) {
    this.BookingCase = a;
    // alert(JSON.stringify(a))
    this.CIFwebService.GetUserResultsDetails(this.user_Email, a.bookingId).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.ResultData = response.item1;
          this.dataSource = response.item1;

          this.tmpsResultData = response.item1;
          this.headHtmlData = this.tmpsResultData[0];
          this.columns = Object.keys(this.tmpsResultData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
          this.loadingIndicator = false;

          this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
            (result: string) => {
              console.log("Modal closed" + result);
            }
          ).catch((res: any) => { });
        }
        else {
          this.ResultData = [];
          if (this.ResultData.length === 0) {
            Swal.fire({
              title: 'No Result Found for this Test',
              icon: 'error'
            }).then(() => {
              window.location.reload();
            });
          }
        }
      },
      error: err => {
        console.log(err)
      }
    });

  }


  ExcelSheetDownload(a: any) {
    let aa = a;
    window.open(this.ServerUrl + aa[0].excelSheet, '_blank');
  }
  VerifyData(a: any) {
    let aa = a;
    window.open(this.ServerUrl + aa[0].resultFile, '_blank');
  }
}
