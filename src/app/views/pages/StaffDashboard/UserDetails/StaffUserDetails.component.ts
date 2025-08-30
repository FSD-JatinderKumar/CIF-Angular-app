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
  selector: 'app-StaffUserDetails',
  templateUrl: './StaffUserDetails.component.html',
  styleUrls: ['./StaffUserDetails.component.scss']
})
export class StaffUserDetailsComponent implements OnInit {
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
  UserDetailsData: any[]=[];
  currentPage = 1;
  itemsPerPage = 10; // 
  tmpsUserDetailsData: any[]=[];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  Remarks: any;
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
    const GetCookieData = this.cookieService.get('StaffUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.getBookingDetails()
  }

  searchQuery: string = ''; // Property to store the search query

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsUserDetailsData = this.UserDetailsData.filter(item => {
      return Object.values(item).some(val => {
        // Convert val to string and check if it matches the query
        const valString = String(val).toLowerCase();
  
        // Check if the val is a userRole and map it to the corresponding page name
        let mappedRole = '';
        if (item.userRole) {
          // Ensure userRole is an array, if it's not, convert it to an array
          const rolesArray = Array.isArray(item.userRole) ? item.userRole : [item.userRole];
  
          // Map the roles to their corresponding page names
          mappedRole = rolesArray.map((userRole: string) => {
            switch (userRole.trim()) {
              case '400':
                return 'page 1';
              case '401':
                return 'page 2';
              case '402':
                return 'page 3';
              default:
                return '';
            }
          }).join(' ').toLowerCase();
        }
  
        // Check if the query matches either the regular field value or the mapped role
        return valString.includes(query) || mappedRole.includes(query);
      });
    });
  }
  
  

  get filteredUserDetailsData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.UserDetailsData;
    }    
    const searchTerm = this.searchQuery.toLowerCase();
    return this.UserDetailsData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) ||     booking.analysisType.toLowerCase().includes(searchTerm)       
    );
  }
 showLoader = true;
  getBookingDetails() {
    this.showLoader = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllUserData().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.UserDetailsData = response.item1;
          this.dataSource = response.item1;
          // console.log(" USER " + JSON.stringify(this.UserDetailsData))
          this.tmpsUserDetailsData = response.item1;
          this.headHtmlData = this.tmpsUserDetailsData[0];
          this.columns = Object.keys(this.tmpsUserDetailsData[0]);
          this.columns = this.columns.filter((item: any) => item !== 'candidateName' && item !== 'userEmail' && item !== 'id' && item !== 'analysisId');
          this.columns.push()
          this.loadingIndicator = false;          
        }
        else {
          this.UserDetailsData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.showLoader = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsUserDetailsData.length / this.itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsUserDetailsData.slice(startIndex, endIndex);
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
    const fileName = 'User_Details_report.xlsx';
    const exportedData = this.UserDetailsData.map(item => ({
      EmailId: item.emailId,
      CanidateName: item.candidateName,
      MobileNo: item.mobileNumber,
      Department: item.departmentName,
      SchoolName: item.organisation,
      SupervisorName: item.supervisorName,
      Designation: item.designation != null? item.designation:'NA',
      Role: item.userRole != null 
      ? item.userRole === '400000' 
        ? 'Internal User' 
        : item.userRole === '400001' 
          ? 'External Acadmeia' 
          : 'Industry User'
      : 'N-A',
       
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
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  VerifyData(UserDetailsData: any) {
    const formData = new FormData();
    formData.append('BookingId', UserDetailsData.bookingId);
    formData.append('UserEmailId', UserDetailsData.userEmailId);
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
