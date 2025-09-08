import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT, Location } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pending-payments',
  templateUrl: './pending-payments.component.html',
  styleUrls: ['./pending-payments.component.scss']
})
export class PendingPaymentsComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
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
    'instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples',
    'totalCharges', 'remarks', 'bookingRequestDate', //'bookingrequestDate'
  ];
  BookingCase: any;
  PaymentDetails: any[] = [];
  PaymentDetailsX: any[] = [];

  currentPage = 1;
  itemsPerPage = 5; //
  tmpsPaymentDetails: any[] = [];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  MobileNo: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  paymentData: any;
  ResponseUrl: any;
  constructor(
    private CIFwebService: LpuCIFWebService, private location: Location,
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
    // this.getParams();
    // "https://devums.lpu.in/app/cif/";
    // this.ResponseUrl = window.location.origin + this.location.path();
    // this.ResponseUrl = window.location.href;
    this.ResponseUrl = '/ResponsePayments';
    // alert(this.ResponseUrl)
    if (this.ResponseUrl.startsWith('https://devums.lpu.in/app')) {
      this.ResponseUrl = "https://devums.lpu.in/app/cif/" + 'PendingPayments';
    }
    const baseUrl = `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;
    
    // Add your desired endpoint
    // this.ResponseUrl = "https://lpu.in/cif/cifDemo/PendingPayments";//   
    this.ResponseUrl = `${baseUrl}/PendingPayments`;
    const GetCookieData = this.cookieService.get('InternalUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.UserId = retrievedCookies.Id;
    this.user_Email = retrievedCookies.EmailId;
    this.MobileNo = retrievedCookies.MobileNo;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;
    this.getUserPaymentDetails(this.user_Email);
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
          // console.log("return encoded "+JSON.stringify(result));

          if (result.status == 'failure') {
            Swal.fire({
              title: 'Payment Failed ',
              // text: 'Payment URL not found!',
              icon: 'error',
            });
          }
          else {
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
  searchQuery: string = '';

  get filteredPaymentDetails(): any[] {
    if (!this.searchQuery.trim()) {
      return this.PaymentDetails;
    }

    const searchTerm = this.searchQuery.toLowerCase();
    return this.PaymentDetails.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)

    );
  }
  getUserPaymentDetails(EmailId: any) {
    this.CIFwebService.GetUserPaymentDetails(EmailId).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.PaymentDetails = this.PaymentDetailsX = response.item1;
          this.dataSource = response.item1;
          this.tmpsPaymentDetails = response.item1;
          this.headHtmlData = this.tmpsPaymentDetails[0];
          this.columns = Object.keys(this.tmpsPaymentDetails[0]);
          this.columns = this.columns.filter((item: any) => item !== 'userEmailId' && item !== 'instrumentId' && item !== 'id' && item !== 'candidateName' && item !== 'mobileNo' && item !== 'facultyCode' && item !== 'createdBy');
          this.columns.push()
          this.loadingIndicator = false;


          // console.log("PaymentDetails  Data  " + JSON.stringify(this.PaymentDetails))
        }
        else {
          this.PaymentDetails = [];
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsPaymentDetails.length / this.itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsPaymentDetails.slice(startIndex, endIndex);
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
    const exportedData = this.PaymentDetails.map(item => ({
      BookingId: item.bookingId,
      InstrumentName: item.instrumentName,
      AssignedTo: item.assignedTo.split(' ').slice(0, -1).join(' '),
      AssignedDate: item.assignedOn,
      Samples: item.noOfSamples,
      RequestDate: item.bookingRequestDate,

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

  openQRCodeScreen(url: string): Promise<any> {
    window.open(url, '_blank');
    return Swal.fire({
      title: 'Scan the QR Code to Proceed with Payment',
      html: `<qrcode [qrdata]="this.qrCodeUrl" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>`,
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Cancel',
    });
  }

  openPaymentModal(a: any) {
    this.BookingCase = a;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  VerifyData(BookingCase: any) {
    const formData = new FormData();
    formData.append('BookingId', BookingCase.id);
    formData.append('InstrumentId', BookingCase.instrumentId);
    formData.append('CandidateName', this.candidateName);
    formData.append('Amount', BookingCase.totalCharges);
    formData.append('Type', this.TypeId);
    formData.append('UserEmailId', this.user_Email);
    formData.append('MobileNo', this.MobileNo);
    formData.append('ResponseUrl', this.ResponseUrl);

    forkJoin({
      payment: this.CIFwebService.MakePaymentforTest(formData),
    }).subscribe({
      next: (results: any) => {
        this.paymentData = results;
        if (results) {
          const paymentUrlData = results.payment.item1[0].url;
          if (paymentUrlData && paymentUrlData.length > 0) {
            // window.location.href = paymentUrlData;
            // window.open(paymentUrlData,"_blank");
            this.openQRCodeScreen(paymentUrlData);
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



  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsPaymentDetails = this.PaymentDetails.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }
}
