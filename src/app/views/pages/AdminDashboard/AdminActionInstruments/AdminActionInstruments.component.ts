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
  selector: 'app-AdminActionInstruments',
  templateUrl: './AdminActionInstruments.component.html',
  styleUrls: ['./AdminActionInstruments.component.scss']
})
export class AdminActionInstrumentsComponent implements OnInit {
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
  InstrumentData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10; // 
  tmpsInstrumentData: any[] = [];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  supervisorName: any;
  departmentName: any;
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
    //// debugger
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
    // this.getSessionDetails();
    const GetCookieData = this.cookieService.get('authData');
      const retrievedCookies = JSON.parse(GetCookieData);
      this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
      this.user_Email = retrievedCookies.EmailId;
      this.supervisorName = retrievedCookies.SupervisorName;
      this.departmentName = retrievedCookies.DepartmentName;
      this.candidateName = retrievedCookies.CandidateName;
    // if (GetCookieData) {
    //   const retrievedCookies = JSON.parse(GetCookieData);
    //   this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    //   this.user_Email = retrievedCookies.EmailId;
    //   this.supervisorName = retrievedCookies.SupervisorName;
    //   this.departmentName = retrievedCookies.DepartmentName;
    //   this.candidateName = retrievedCookies.CandidateName;
    // } else {
    //   swal.fire({
    //     title: 'Login Failed ',
    //     icon: 'warning',
    //   });
    //   this.router.navigate(['/Home']);
    // }
    this.GetAllInstruments()
  }

  searchQuery: string = ''; // Property to store the search query

  get filteredInstrumentData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.InstrumentData;
    }

    // Otherwise, filter data based on search query
    const searchTerm = this.searchQuery.toLowerCase();
    return this.InstrumentData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)

    );
  }
  GetAllInstruments() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllInstruments().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentData = response.item1;
          this.dataSource = response.item1;
          this.tmpsInstrumentData = response.item1;

          this.headHtmlData = this.tmpsInstrumentData[0];
          this.columns = Object.keys(this.tmpsInstrumentData[0]);

        }
        else {
          this.InstrumentData = [];
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

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsInstrumentData = this.InstrumentData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsInstrumentData.length / this.itemsPerPage);
  }

  // Function to get the current page of data
  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsInstrumentData.slice(startIndex, endIndex);
  }

  // Function to go to the next page
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
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  OpenModalWindow(a: any) {
    this.BookingCase = a;
    let InstrumentID = a['instrumentId'];
    const formData = new FormData();
    formData.append('Id', InstrumentID);
    swal.fire({
      title: 'Are you sure you want to Change State of Device ?',
      // text: 'Kindly confirm if the document is valid!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept current changes!',
      cancelButtonText: 'No, do not change it'
    }).then((result: any) => {
      if (result.value) {
        this.handleStatusChange(formData, 'Approve');
      } else {
        this.showCancelledSwal();
      }
    });
  }
  private handleStatusChange(formData: FormData, action: string) {
    this.CIFwebService.CIFUpdateStatusInstruments(formData).subscribe((data: any) => {
      // this.mouDocumentsService.ApproveMouActionTakenDocument(formData).subscribe((data: any) => {
      if (action === 'Approve' && data.responseData === 'Cancel') {
        swal.fire(
          'No Change!',
          ' ',
          'error'
        );
      } else {
        swal.fire(
          ' Status Changed Successfully !',
          '',
          'success'
        ).then(() => {
          window.location.reload();
        });
      }
    });
  }

  private showCancelledSwal() {
    swal.fire(
      'Cancelled',
      ' ',
      'error'
    );
  }



  VerifyData(InstrumentData: any) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    const formData = new FormData();
    formData.append('BookingId', InstrumentData.bookingId);
    formData.append('UserEmailId', InstrumentData.userEmailId);
    formData.append('UserId', this.UserId);
    formData.append('Remarks', ' No Remarks from ' + this.UserId);
    formData.append('FilePath', this.fileName);
    formData.append('File', this.FileData);
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    this.CIFwebService.CIFResultsUploads(formData).subscribe({
      next: (data: any) => {
        const result = data.item1[0]['msg'];
        if (result === 'success') {
          swal.fire({
            title: 'Uploaded Successfully!',
            // text: '',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        } else {
          swal.fire({
            title: 'Error Occured, Try Again Later',
            icon: 'error'
          });
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: (error: any) => {
        swal.fire({
          title: 'Error',
          text: 'Failed to Upload.',
          icon: 'error'
        });
      },
      complete: () => {
        window.location.reload();
      }
    });

  }

  onFileSelected(event: any): void {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file && file.size > 3148576) {
      swal.fire({
        title: 'File size exceeds 3MB. Please upload a smaller file.',
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

  }





  @ViewChild('viewDescModal') viewDescModals: TemplateRef<any>;


  validationForm1: FormGroup;
  isForm1Submitted: boolean = false;
  ITitle: string = '';
  IStatus: string = '';
  IDescription: string = '';
  fileNames: any = '';

  get form1() {
    return this.validationForm1.controls;
  }

  AllInstrumentsDetails: any[] = []; TempAllInstrumentsDetails: any[] = [];
  headHtmlDatas: never[]; isInputDisabled: boolean = true; InstrumentIds: any; InstrumentTitles: any;
  fileNamesX: string; ColumnModes = ColumnMode; FileDataX: string; searchQueryx: any; StatusInstrument: any = false;
  fileDataX: File;

  ChangeStatus(event: any) {
    this.StatusInstrument = event.target.checked;
    // alert(this.StatusInstrument);
  }

  searchx() {
    const query = this.searchQueryx.toLowerCase();
    this.TempAllInstrumentsDetails = this.AllInstrumentsDetails.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  onSelectFile(a: any) {
    let aa = a;
    window.open(aa.imageUrl, '_blank');
  }


  exportToExcels(): void {
    const fileName = 'Instruments_Document_report.xlsx';
    const exportedData = this.AllInstrumentsDetails.map(item => ({
      Id: item.instrumentId,
      Title: item.instrumentName,
      Description: item.description
    }));
    const header = [
      'Id',
      'Title',
      'Description',
    ];
    const ws_data = [header, ...exportedData.map(item => Object.values(item))];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ws_data);
    for (let i = 1; i < ws_data.length; i++) { // Start from 1 to skip the header row
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: 3 }); // Column 7 is DocumentUrl
      const cell = ws[cellAddress];
      if (cell && cell.v) {
        cell.f = `HYPERLINK("${cell.v}", "Download Attachement")`;
      }
    }
    const wscols = [
      { wpx: 200 }, { wpx: 200 }, { wpx: 200 }
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
  onSelect(a: any) {
    let aa = a;
    this.InstrumentId = aa['id'];
    this.InstrumentTitles = aa['instrumentName'];
    this.modalService.open(this.viewDescModal, { size: 'sm' }).result.then((result) => {

      console.log("Modal closed" + result);
    }).catch((res) => { });
  }




  fileChosen: { [key: number]: boolean } = {};
  onFileXSelected(event: any, id: number): void {
    this.fileChosen[id] = event.target.files.length > 0;
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;

    if (file && file.size > 10148576) {
      swal.fire({
        title: 'File size exceeds 10 MB. Please upload a smaller file.',
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

      this.fileDataX = modifiedFile;
      this.fileStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileDataX = ssssArray[1];
        this.fileName = validFileName;
      };
      return;
    }

    this.fileDataX = file;
    this.fileStatus = true;

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileDataX = ssssArray[1];
        this.fileName = file.name;
      };
    }
  }


  UpdateFileDocument(Id: any) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    if (this.fileChosen[Id]) {
      const formData = new FormData();
      formData.append('InstrumentId', Id);
      formData.append('IsActive', this.StatusInstrument);
      formData.append('FilePath', this.fileName);
      formData.append('File', this.FileDataX);

      this.CIFwebService.UpdateInstrumentImageFile(formData).subscribe({
        next: (data: any) => {
          const result = data.item1[0]['msg'];
          if (result === 'ok') {
            swal.fire({
              title: 'Uploaded the Document',
              text: 'Document uploaded successfully!',
              icon: 'success',
              timer: 5000, // Display for 3 seconds
              showConfirmButton: false,
            }).then(() => {
              window.location.reload(); // Reload the page after the success message
            });
          } else if (result === 'Failed') {
            swal.fire({
              title: 'Failed to Upload',
              text: result,
              icon: 'error',
              timer: 5000, // Display for 3 seconds
              showConfirmButton: false,
            });
          }

          const elapsed = new Date().getTime() - startTime;
          const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

          setTimeout(() => {
            this.loadingIndicator = false;
          }, remainingDelay);
        },
        error: (error: any) => {
          swal.fire({
            title: 'Error',
            text: 'Internal Server error',
            icon: 'error',
            timer: 10000, // Display for 3 seconds
            showConfirmButton: false,
          });
        },
        complete: () => {

        },
      });
    }
  }


}
