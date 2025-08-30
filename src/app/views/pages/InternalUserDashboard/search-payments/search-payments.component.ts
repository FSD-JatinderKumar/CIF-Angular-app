import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

import { ColumnMode } from '@swimlane/ngx-datatable';



@Component({
  selector: 'app-search-payments',
  templateUrl: './search-payments.component.html',
  styleUrls: ['./search-payments.component.scss']
})
export class SearchPaymentsComponent implements OnInit {

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
  itemsPerPage = 5; //
  tmpsBookingStatusData: any[] = [];
  tmpsResultData: any[] = [];
  PaymentReceipt: any;
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  Remarks: any;
  dataSource: any;
  ServerUrl: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    
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
    this.ServerUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    const GetCookieData = this.cookieService.get('InternalUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.EmailId;
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
    this.CIFwebService.GetUserPaymentStatusDetails(this.UserId).subscribe({
      next: response => {
        
        if (response.item1 && response.item1.length > 0) {
          // this.BookingStatusData = response.item1;
          this.dataSource = response.item1;
          this.BookingStatusData = this.tmpsBookingStatusData = response.item1.filter((item: { paymentStatus: any }) =>
            item.paymentStatus?.toLowerCase() == 'success' && item.paymentStatus != 'null'
          );

          // console.log(" Data " + JSON.stringify(this.tmpsBookingStatusData))
          this.headHtmlData = this.tmpsBookingStatusData[0];
          this.columns = Object.keys(this.tmpsBookingStatusData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
          this.loadingIndicator = false;
        }
        else {
          this.BookingStatusData = [];
        }
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
  paymentReceiptScreen(data: any) {
    this.PaymentReceipt = data;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch(() => { });
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

}
