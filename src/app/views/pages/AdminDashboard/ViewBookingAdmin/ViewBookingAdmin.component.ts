import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT } from '@angular/common';
import { MouDocumentsService } from 'src/app/_services/mou-documents.service';

@Component({
  selector: 'app-ViewBookingAdmin',
  templateUrl: './ViewBookingAdmin.component.html',
  styleUrls: ['./ViewBookingAdmin.component.css']
})
export class ViewBookingAdminComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;

  FileData: any; array: any[] = []; fileData: File; fileStatus: boolean = false;
  fileName: string;     selectedId: number;  ColumnMode = ColumnMode;  columns: any;
  loadingIndicator = false;   headHtmlData: any[] = [];
  p: any = 1;   perPage: any = 5;   perPages: any = 5;  currentPages: any=1; itemsPerPages = 10;
  BookingCase: any;   BookingData: any[]=[];      currentPage = 1;    itemsPerPage = 10; //
  UplaodedResultsData: any[]=[]; tmpUplaodedResultsData: any[]=[];
  tmpsBookingData: any[]=[];    InstrumentId: any;    UserRole: any;  UserId: any;
  uploadEnabled: boolean; Remarks: any;   serverUrl: string;

  isLoginFailed: boolean = false;     EmployeeDetails: any;  EmployeeName: any;  EmployeeCode: any;
  ContactNoX: any;    Department: any;  DepartmentName: any;  showNoDataFoundMessage: boolean;
 
  @ViewChild('table') table: ElementRef;
  displayedColumns: string[] = [
    'instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples',
    'totalCharges', 'remarks', 'bookingRequestDate', //'bookingrequestDate'
  ];
   
  constructor(
    private CIFwebService: LpuCIFWebService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService,  private mouDocumentsService: MouDocumentsService,) { }
  user_Email: any;
  sessionData: any[] = [];
  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
 
    this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';//'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    // const GetCookieData = this.cookieService.get('authData');
    // const retrievedCookies = JSON.parse(GetCookieData);
    // this.UserRole = retrievedCookies.UserRole;
    // this.UserId = retrievedCookies.EmailId;
    
    let loginName = this.route.snapshot.params['loginName'];
    if (loginName != '' && loginName != undefined) {
      this.getToken(loginName);
    }
   
  }
  getToken(id: any) 
  {
    
    this.authService.loginTemp(id).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.GetEmployeeDetails();
        this.GetAllUPloadedResults();
      },
      error: _err => {
        this.LoginFailed(_err);
      }
    });
  }

  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    })
    const element = document.getElementById('CIFForm');
    if (element) {
      element.hidden = true;
    }
  }

  GetEmployeeDetails(): void {
   // debugger
    this.mouDocumentsService.GetEmployeeDetails().subscribe({
      next: response => {
        if (response.item1.length > 0) {
          this.EmployeeDetails = response.item1;
          this.EmployeeName = response.item1[0].employeeName;
          this.EmployeeCode = response.item1[0].employeeCode;
          this.ContactNoX = response.item1[0].contactNo;
          this.Department = response.item1[0].department;
          this.DepartmentName = response.item1[0].departmentName;
          this.loadingIndicator = false;
          this.showNoDataFoundMessage = false;
          this.isLoginFailed = false;
          this.getBookingDetails();
        } else {
          this.EmployeeDetails = [];
          this.showNoDataFoundMessage = true;
          this.isLoginFailed = true;
        }
      },
      error: err => {
        this.LoginFailed(err);
      }
    });
  }
  searchQuery: string = ''; // Property to store the search query

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsBookingData = this.BookingData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }


  get filteredBookingData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.BookingData;
    }
    const searchTerm = this.searchQuery.toLowerCase();
    return this.BookingData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) ||     booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }
  GetAllUPloadedResults() {
    this.CIFwebService.GetAllUploadedResultsByStaff().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.UplaodedResultsData = response.item1;
          this.dataSource = response.item1;
          this.tmpUplaodedResultsData = response.item1;
          this.headHtmlData = this.UplaodedResultsData[0];
          this.columns = Object.keys(this.UplaodedResultsData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
          this.loadingIndicator = false;
        }
        else {
          this.UplaodedResultsData = [];
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  searchQueryx: string = '';  

  searchx() {
    const query = this.searchQueryx.toLowerCase();
    this.tmpUplaodedResultsData = this.UplaodedResultsData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  getTotalPagess() {
    return Math.ceil(this.tmpUplaodedResultsData.length / this.itemsPerPages);
  }

  getCurrentResultsPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpUplaodedResultsData.slice(startIndex, endIndex);
  }

 
  nextPages() {
    if (this.currentPages < this.getTotalPagess()) {
      this.currentPages++;
    }
  }

  prevPages() {
    if (this.currentPages > 1) {
      this.currentPages--;
    }
  }

  exportToExcels(): void {
    const fileName = 'UploadedResults_report.xlsx';
    const exportedData = this.UplaodedResultsData.map(item => ({
      UserEmail: item.userId,
      CandidateName: item.candidateName,
      BookingId: item.bookingId,
      Instrument: item.instrumentName,
      TotalCharges: item.totalCharges,
      noOfSamples: item.noOfSamples,
      BookingDate: item.allocatedOn ,
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



  // Tab -1 
  getBookingDetails() {
    this.CIFwebService.GetAllBooking().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.BookingData = response.item1;
          this.dataSource = response.item1;
          this.tmpsBookingData = response.item1;
          this.headHtmlData = this.tmpsBookingData[0];
          this.columns = Object.keys(this.tmpsBookingData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
          this.loadingIndicator = false;
        }
        else {
          this.BookingData = [];
        }
      },
      error: err => {
        console.log(err)
      }
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
    const fileName = 'AssignedResults_report.xlsx';
    const exportedData = this.BookingData.map(item => ({
      UserEmail: item.userId,
      CandidateName: item.candidateName,
      BookingId: item.bookingId,
      Instrument: item.instrumentName,
      TotalCharges: item.totalCharges,
      noOfSamples: item.noOfSamples,
      BookingDate: item.allocatedOn ,
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
  downloadUploadResult(FileResult: any): void{
    const url = this.serverUrl + FileResult;
    window.open(url, '_blank');
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
    const formData = new FormData();
    formData.append('BookingId', BookingData.bookingId);
    formData.append('UserEmailId', BookingData.userId);
    formData.append('CreatedBy',  this.EmployeeCode);
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
  onFileSelected(event: any): void {
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
