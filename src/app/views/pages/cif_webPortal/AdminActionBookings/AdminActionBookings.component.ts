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
  selector: 'app-AdminActionBookings',
  templateUrl: './AdminActionBookings.component.html',
  styleUrls: ['./AdminActionBookings.component.scss']
})
export class AdminActionBookingsComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;

  FileData: any; array: any[] = []; fileData: File; fileStatus: boolean = false;
  fileName: string;
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
  BookingData: any[]=[];
  currentPage = 1;
  itemsPerPage = 10; //
  tmpsBookingData: any[]=[];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
Remarks: any;
  serverUrl: string;

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
    this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';//'http://172.19.2.52/umsweb/webftp/CIFDocuments/';
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.EmailId;
    this.getBookingDetails()
  }

  searchQuery: string = ''; 

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsBookingData = this.BookingData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }


  get filteredBookingData(): any[] {
    if (!this.searchQuery.trim()) {
      return this.BookingData;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    return this.BookingData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) ||     booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }
  getBookingDetails() {
    this.loadingIndicator=true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllBookingTests().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.BookingData = response.item1;
          this.dataSource = response.item1;
          this.tmpsBookingData = response.item1;
          this.originalData = [...this.BookingData];  
          this.headHtmlData = this.tmpsBookingData[0];
          this.columns = Object.keys(this.tmpsBookingData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
        }
        else {
          this.BookingData = [];
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


  originalData: any[] = []; // Loaded from API
  filteredData: any[] = [];
  selectedStatus: string = '';

  filterData(): void {
    if (this.selectedStatus === '') {
      this.tmpsBookingData = [...this.originalData]; // Show all data
    } else if (this.selectedStatus === 'null') {
      this.tmpsBookingData = this.originalData.filter(item => item.paymentStatus === null);
    } else {
      this.tmpsBookingData = this.originalData.filter(item => item.paymentStatus === this.selectedStatus);
    }
    this.currentPage = 1; // Reset to first page after filtering
  }

  statusOptions = [
    { label: 'All', value: '' }, 
    { label: 'Success', value: 'success' },
    { label: 'Failure', value: 'failure' },
    { label: 'Pending', value: 'null' }
  ];
  

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
    const fileName = 'AssignedResults_report.xlsx';
    const exportedData = this.BookingData.map(item => ({
      BookingId: item.bookingId,
      InstrumentName: item.instrumentName,      
      EmailId: item.userEmailId,
      candidateName: item.candidateName,
      OrganisationName:item.organisationName,
      UserRole:item.userRole,
      Samplecount: item.noOfSamples,
      PaymentAmount: item.totalCharges,
      RequestDate: item.bookingRequestDate,
      PaymentStatus: item?.paymentStatus === 'success' ? 'Paid' :      item?.paymentStatus === 'failure' ? 'Failed' :      'Pending',
      BookingDate: item.paymentDate ,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportedData);

    const wscols = [
      { wpx: 280 }, { wpx: 280 }, { wpx: 280 },{ wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 },{ wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }, { wpx: 280 }
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

  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
    }
  openPaymentModal(a: any) {
    this.BookingCase = a;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  VerifyData(BookingData: any) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    if (this.FileData) {
      const formData = new FormData();
      formData.append('BookingId', BookingData.bookingId);
      formData.append('UserEmailId', BookingData.userEmailId);
      formData.append('CreatedBy', this.user_Email);
      formData.append('FilePath', this.fileName);
      formData.append('File', this.FileData);
      this.CIFwebService.CIFResultsUploads(formData).subscribe({
        next: (data: any) => {
          const result = data.item1[0]['msg']; // Adjusted to match your stored procedure
          const returnId = data.item1[0]['ReturnId'];

          if (result === 'Success' && returnId !== '0') {
            Swal.fire({
              title: 'Uploaded Successfully!',
              icon: 'success'
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: 'Already Uploaded Results for this Test',
              icon: 'error'
            }).then(() => {
              window.location.reload();
            });
          }
          const elapsed = new Date().getTime() - startTime;
          const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

          setTimeout(() => {
            this.loadingIndicator = false;
          }, remainingDelay);
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to Upload.',
            icon: 'error'
          });
        }
      });
    }
    else {
      Swal.fire({
        title: 'Error',
        text: 'Kindly Upload File.',
        icon: 'error'
      });
    }
  }


  onFileSelected(event: any): void {
    this.fileStatus= false;
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file && file.size > 5148576) {
      swal.fire({
        title: 'File size exceeds 5MB. Please upload a smaller file.',
        text: 'Invalid File size',
        icon: 'warning'
      });
      target.value = '';
      return;
    }

    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (file && !fileNameRegex.test(file.name)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

      const modifiedFile = new File([file], validFileName, { type: file.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(modifiedFile);
      target.files = dataTransfer.files;

      this.fileData = modifiedFile;
      this.fileStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileData = ssssArray[1];
        this.fileName = validFileName;
      };
      this.uploadEnabled = true;
      return;
    }

    this.fileData = file;
    this.fileStatus = true;
    // alert(10);
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileData = ssssArray[1];
        this.fileName = file.name;
      };
    }
  }

  UploadDocument() {
    const formData = new FormData();   
  }
}
