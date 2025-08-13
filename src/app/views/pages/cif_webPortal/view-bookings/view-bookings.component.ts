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
import { DOCUMENT, Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss'],
  providers: [DatePipe]
})
export class ViewBookingsComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream')
  ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  @ViewChild('ViewUpdateStatusModal') ViewUpdateStatusModal: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;

  TypeId: any = 'CIF';
  selectedId: number;
  ColumnMode = ColumnMode;
  columns: any;
  loadingIndicator = false;
  headHtmlData: any[] = [];
  p: any = 1;
  perPage: any = 5;
  @ViewChild('table') table: ElementRef;
  displayedColumns: string[] = [
    'instrumentName',
    'analysisType',
    'analysisCharges',
    'noOfSamples',
    'totalCharges',
    'remarks',
    'bookingRequestDate', //'bookingrequestDate'
  ];
  BookingCase: any;
  BookingData: any[] = [];

  currentPage = 1; itemsPerPage = 5; tmpsBookingData: any[] = []; paymentresult: PaymentRequest[] = []; paymentData: any;
  InstrumentId: any; UserRole: any; UserId: any; MobileNo: any; departmentName: any; candidateName: any; supervisorName: any; serverUrl: any;
  ResponseUrl: any;

  constructor(
    private CIFwebService: LpuCIFWebService, private location: Location,
    private storageService: StorageService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { }
  user_Email: any; qrCodeUrl: string; sessionData: any[] = [];

  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail'];
    }
  }
  ngOnInit(): void {
    this.getParams();
    this.ResponseUrl = window.location.origin + '/ViewBookings';//this.location.path(); 
    // start code added on 9-aug-25
    // Build dynamic base URL from current location
    const baseUrl = `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;

    // Add your desired endpoint
     this.ResponseUrl = `${baseUrl}/ViewBookings`;
    // alert(this.ResponseUrl);

    // // alert(this.ResponseUrl)
    // if (this.ResponseUrl.startsWith('https://devums.lpu.in/app/cif/')) {
    //   this.ResponseUrl = "https://devums.lpu.in/app/cif/";
    // }
    // alert (this.ResponseUrl)
    // end code on 9-aug-25
    this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';// https://files.lpu.in/umsweb/Journal/
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole =
      retrievedCookies.userRole?.length > 0
        ? retrievedCookies.userRole
        : 'Internal User';
    this.UserId = retrievedCookies.Id;
    this.user_Email = retrievedCookies.EmailId;
    this.MobileNo = retrievedCookies.MobileNo;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;

    this.getBookingDetails();
    this.fetchAllSampleStatus();
  }
  id: any; status: any; type: any; transactionNo: any; hashedValue: any; course: any; keyNote: any;
  getParams(): void {
    // const params = this.route.snapshot.params;
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.status = params.get('status');
      this.type = params.get('type');
      this.transactionNo = params.get('transactionNo');
      this.hashedValue = params.get('hashedValue');
      this.course = params.get('Course');
      this.keyNote = params.get('KeyNote');
      const formData = new FormData();
      formData.append('Id', this.id);
      formData.append('Status', this.status);
      formData.append('Type', this.type);
      formData.append('TransactionNo', this.transactionNo);
      formData.append('Course', this.course);
      formData.append('KeyNote', this.keyNote);
      formData.append('HashedValue', this.hashedValue);

      var result;
      this.CIFwebService.GetDecodePaymentStatusDetails(formData).subscribe({
        next: data => {
          result = data;
          // console.log("return encoded " + JSON.stringify(result));

          if (result?.status == 'failure') {
            Swal.fire({
              title: 'Payment Failed ',
              // text: 'Payment URL not found!',
              icon: 'error',
            });
          }
          else if (result?.status == 'success') {
            Swal.fire({
              title: 'Payment Made Successfully',
              // text: 'Payment URL not found!',
              icon: 'success',
            });
          }
        },
      });
    });
  }
  searchQuery: any = '';

  get filteredBookingData(): any[] {
    if (!this.searchQuery.trim()) {
      return this.BookingData;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    return this.BookingData.filter(
      (booking: { instrumentName: string; analysisType: string }) =>
        booking.instrumentName.toLowerCase().includes(searchTerm) ||
        booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }
  getBookingDetails() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetUserAllBookingSlot(this.user_Email).subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.BookingData = response.item1;
          this.dataSource = response.item1;

          this.tmpsBookingData = response.item1;

          this.headHtmlData = this.tmpsBookingData[0];
          this.columns = Object.keys(this.tmpsBookingData[0]);
          this.columns = this.columns.filter(
            (item: any) =>
              item !== 'bookingRequestDate' &&
              item !== 'instrumentId' &&
              item !== 'id' &&
              item !== 'analysisId'
          );

          this.columns.push();
          this.loadingIndicator = false;
        } else {
          this.BookingData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(2500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsBookingData.length / this.itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsBookingData.slice(startIndex, endIndex);
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
    const exportedData = this.BookingData.map(item => ({
      BookingId: item.bookingId,
      InstrumentName: item.instrumentName,
      AnalysisType: item.analysisType,
      AnalysisCharges: item.analysisCharges,
      Samples: item.noOfSamples,
      totalCharges: item.totalCharges,
      RequestDate: this.datePipe.transform(item.bookingRequestDate, 'dd/MM/yyyy')


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
    this.modalService
      .open(this.viewDescModal2, { size: 'sm' })
      .result.then((result: string) => {
        console.log('Modal closed' + result);
      })
      .catch((res: any) => { });
  }

  VerifyData(BookingCase: any) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    const formData = new FormData();
    formData.append('BookingId', BookingCase.id);
    formData.append('InstrumentId', BookingCase.instrumentId);
    formData.append('CandidateName', this.candidateName);
    formData.append('Amount', BookingCase.totalCharges);
    formData.append('Type', this.TypeId);
    formData.append('UserEmailId', this.user_Email);
    formData.append('MobileNo', this.MobileNo);
    formData.append('FacultyCode', this.user_Email);
    formData.append('ResponseUrl', this.ResponseUrl);
    forkJoin({
      payment: this.CIFwebService.MakePaymentforTest(formData),
    }).subscribe({
      next: (results: any) => {
        this.paymentData = results;
        if (results) {
          const paymentUrlData = results.payment.item1[0].url;
          if (paymentUrlData && paymentUrlData.length > 0) {
            window.location.href = paymentUrlData;

          } else {
            Swal.fire({
              title: 'Error Occurred, Try Again Later',
              text: 'Payment URL not found!',
              icon: 'error',
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No data received from the API!',
            icon: 'error',
          });
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(2500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: (error: any) => {
        console.error('Error during API call: ', error);
        Swal.fire({
          title: 'Error',
          text: 'Payment Gateway Failed!',
          icon: 'error',
        });
      },
    });
  }


  openQRCodeScreen(url: string): Promise<any> {
    return Swal.fire({
      title: 'Scan the QR Code to Proceed with Payment',
      html: `<qrcode [qrdata]="this.qrCodeUrl" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>`,
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      // Check if the user clicked the confirm button
      if (result.isConfirmed) {
        // Open the URL in a new tab
        window.open(url);
      }
    });

  }

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsBookingData = this.BookingData.filter((item) => {
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
  }
  ToGetSampleforId: any;
  ToGetSampleforInstrumentId: any;
  SampleStatusData: any; dataSourceSamples: any;

  GetStatus(Data: any) {
    this.ToGetSampleforId = Data['bookingId']; // Use bookingId
    this.ToGetSampleforInstrumentId = Data['instrumentId'];

    // Filter the samples based on bookingId and instrumentId
    this.SampleStatusData = this.dataSourceSamples.filter(
      (item: any) =>
        item.bookingId == this.ToGetSampleforId && // Match bookingId
        item.instrumentId == this.ToGetSampleforInstrumentId // Match instrumentId
    );

    // Check if any data was found
    if (this.SampleStatusData?.length > 0) {
      // If found, open the modal
      this.modalService
        .open(this.ViewUpdateStatusModal, { size: 'sm' })
        .result.then((result: string) => {
          console.log('Modal closed: ' + result);
        })
        .catch((res: any) => { });
    } else {
      // Handle case where no data is found
      this.SampleStatusData = []; // Ensure it's an empty array
      swal.fire({
        title: 'No Data Found',
        text: 'No sample status data available for the selected booking and instrument.',
        icon: 'info'
      });
    }
  }

  fetchAllSampleStatus() {
    this.CIFwebService.GetAllSampleStatus().subscribe({
      next: (response) => {
        if (response.item1 && response.item1.length > 0) {
          this.SampleStatusData = response.item1;
          this.dataSourceSamples = response.item1;
          // console.log(JSON.stringify(this.SampleStatusData))
        } else {
          this.SampleStatusData = [];
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
