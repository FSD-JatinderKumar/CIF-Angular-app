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
import { DOCUMENT , Location } from '@angular/common';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-search-payments-pending',
  templateUrl: './search-payments-pending.component.html',
  styleUrls: ['./search-payments-pending.component.scss']
})
export class SearchPaymentsPendingComponent implements OnInit {
  ResponseUrl: any;

  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  @ViewChild('viewDescModal5') viewDescModal5: TemplateRef<any>;
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
  BookingStatusData: any[] = [];
  ResultData: any[] = [];
  currentPage = 1;
  itemsPerPage = 5; //
  tmpsBookingStatusData: any[] = [];
  tmpsResultData: any[] = [];
  PaymentReceipt: any;
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  Remarks: any;
  ServerUrl: any;
  MobileNo: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  paymentData: any;
  id: any; status: any; type: any; transactionNo: any; hashedValue: any; course: any; keyNote: any;

  constructor(
    private CIFwebService: LpuCIFWebService,private location: Location,
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
    this.route.queryParamMap.subscribe((params) => {
      const queryParamLength = params.keys.length;
      if (queryParamLength > 0) {
        this.getParams();
      }
    });
    this.ServerUrl ='https://files.lpu.in/umsweb/MOUDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    this.ResponseUrl = window.location.href;// + this.location.path() ;//"https://devums.lpu.in/app/cif/";
    if (this.ResponseUrl.startsWith('https://devums.lpu.in/app/cif/')) {
      this.ResponseUrl = "https://devums.lpu.in/app/cif/";
    } 

    const baseUrl = `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;
    
     // Add your desired endpoint
    this.ResponseUrl = `${baseUrl}/SearchPendingPayments`;

    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.UserId = retrievedCookies.Id;
    this.user_Email = retrievedCookies.EmailId;
    this.MobileNo = retrievedCookies.MobileNo;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;


    this.UserRole = retrievedCookies.UserRole;
    this.user_Email=  this.UserId = retrievedCookies.EmailId;
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
    this.CIFwebService.GetUserPaymentStatusDetails(this.UserId).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.BookingStatusData = response.item1;
          this.dataSource = response.item1;
          this.tmpsBookingStatusData = response.item1.filter((item: { paymentStatus: any }) =>
            item.paymentStatus == null ||
            item.paymentStatus?.toLowerCase().includes('failure')
          );
          // this.BookingStatusData = this.tmpsBookingStatusData = response.item1;//.filter((item: { paymentStatus: any }) => item.paymentStatus == null);
          if (this.tmpsBookingStatusData.length > 0) {
            this.headHtmlData = this.tmpsBookingStatusData[0];
            this.columns = Object.keys(this.tmpsBookingStatusData[0]);
            this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
            this.columns.push()            
          }
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
  paymentReceiptScreen(data:any)
  {
    this.PaymentReceipt=data;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });
  }
   printReceipt(): void {
    const modalContent = document.getElementById("ReceiptData");  // Get the modal content by its ID
  
    if (modalContent) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
  
      const iframeDoc = iframe.contentWindow?.document;
  
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write('<html><head><title>Payment Receipt</title>');
        
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join(' ');
            } catch (e) {
              return '';
            }
          })
          .join(' ');
  
        iframeDoc.write(`<style>${styles}</style>`);  
        iframeDoc.write('</head><body >');
        
        const clonedContent = modalContent.cloneNode(true) as HTMLElement;
        const printButton = clonedContent.querySelector("button"); 
        if (printButton) {
          printButton.style.display = "none"; 
        }
  
        iframeDoc.write(clonedContent.innerHTML); 
        iframeDoc.write('</body></html>');
        iframeDoc.close();
  
        
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
  
          iframe.onload = () => {
            document.body.removeChild(iframe);
          };
        };
      } else {
        console.error('Failed to open iframe document');
      }
    } else {
      console.error('Modal content not found');
    }
  }
  
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

  openPaymentModal(a: any) {
    this.BookingCase = a;
    this.modalService.open(this.viewDescModal5, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  VerifyData(BookingCase: any) {
    // console.log(JSON.stringify(BookingCase))
    const formData = new FormData();
    formData.append('BookingId', BookingCase.bookingId);
    formData.append('InstrumentId', BookingCase.instrumentId);
    formData.append('CandidateName', this.candidateName);
    formData.append('Amount', BookingCase.amount);
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
            // this.router.navigateByUrl(paymentUrlData);
            // window.open(paymentUrlData,"_blank");

            // this.openQRCodeScreen(paymentUrlData);
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
    });}

}
