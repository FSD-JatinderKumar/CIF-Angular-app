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
  selector: 'app-AdminNewInstruments',
  templateUrl: './AdminNewInstruments.component.html',
  styleUrls: ['./AdminNewInstruments.component.scss']
})
export class AdminNewInstrumentsComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;

  dataSource: MatTableDataSource<any>;

  isLoginFailed: boolean = false; dynamicForm: FormGroup;
  responses: any;
  properties: any[] = [];
  responsesData: any[] = [];

  FileData: any; array: any[] = []; fileData: File; fileStatus: boolean = false;
  fileName: string;
  selectedId: number;
  columns: any;
  loadingIndicator = false;
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
  itemsPerPage = 5; // 
  tmpsInstrumentData: any[] = [];
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  fileDataX: File;
  supervisorName: any;
  departmentName: any;
  candidateName: any;




  constructor(
    private CIFwebService: LpuCIFWebService, private LpuCIFWebInstrumentService: LpuCIFWebService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,

    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) document: Document,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    private cookieService: CookieService) { }
  user_Email: any; sessionData: any[] = [];


  validationForm1: FormGroup; isForm1Submitted: boolean = false; ITitle: string = ''; IStatus: string = ''; IDescription: string = '';
  fileNames: any = '';

  get InstrumentTitle() { return this.validationForm1.get('InstrumentTitle'); }
  get Description() { return this.validationForm1.get('Description'); }
  get Status() { return this.validationForm1.get('Status'); }
  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
    const GetCookieData = this.cookieService.get('authData');
    if (GetCookieData) {
      const retrievedCookies = JSON.parse(GetCookieData);
      this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
      this.user_Email = retrievedCookies.EmailId;
      this.supervisorName = retrievedCookies.SupervisorName;
      this.departmentName = retrievedCookies.DepartmentName;
      this.candidateName = retrievedCookies.CandidateName;
    } else {
       swal.fire({
        title: 'Login Failed ',
        icon: 'warning',
      });
      this.router.navigate(['/cifWebPortal']);
    }
    this.getAllInstrumentsDetail();
    this.LoadForm();
  }



  getAllInstrumentsDetail(): void {
    this.loadingIndicator=true;
    const startTime = new Date().getTime();


    this.LpuCIFWebInstrumentService.GetAllInstruments().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.AllInstrumentsDetails = response.item1;
        this.TempAllInstrumentsDetails = this.AllInstrumentsDetails;
        
        this.columns = []; this.headHtmlData = [];
        this.headHtmlData = this.TempAllInstrumentsDetails[0];
        this.columns = Object.keys(this.TempAllInstrumentsDetails[0]);
        this.columns = this.columns.filter((item: any) => item !== 'imageUrl' && item !== 'instrumentStatus' && item !== 'description' && item !== 'isActive' && item !== 'id' && item !== 'labId' && item !== 'labName' && item !== 'isHourly');
        this.columns.push()
        
      }
      else {
        this.TempAllInstrumentsDetails = [];
      }
      const elapsed = new Date().getTime() - startTime;
      const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

      setTimeout(() => {
        this.loadingIndicator = false;
      }, remainingDelay);
    });
  }
  LoadForm(): void {
    this.validationForm1 = this.formBuilder.group({
      InstrumentTitle: ['', Validators.required],
      Description: ['', Validators.required],
      Status: ['', Validators.required],
      file: [null, Validators.required],
    });
  }





  AllInstrumentsDetails: any[] = []; TempAllInstrumentsDetails: any[] = [];
  headHtmlData: never[]; isInputDisabled: boolean = true; InstrumentId: any; InstrumentTitles: any;
  fileNamesX: string; ColumnMode = ColumnMode; FileDataX: string; searchQueryx: any; StatusInstrument: any = false;


  ChangeStatus(event: any) {
    this.StatusInstrument = event.target.checked;
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


  exportToExcel(): void {
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
    for (let i = 1; i < ws_data.length; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: 3 });
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
    this.InstrumentId = aa['instrumentId'];
    this.InstrumentTitles = aa['instrumentName'];
    this.modalService.open(this.viewDescModal, { size: 'sm' }).result.then((result) => {

      console.log("Modal closed" + result);
    }).catch((res) => { });
  }

  get form1() {
    return this.validationForm1.controls;
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
    this.loadingIndicator=true;
    const startTime = new Date().getTime();


    if (this.fileChosen[Id]) {
      const formData = new FormData();
      formData.append('InstrumentId', Id);
      formData.append('IsActive', this.StatusInstrument);
      formData.append('FilePath', this.fileName);
      formData.append('File', this.FileDataX);

      this.LpuCIFWebInstrumentService.CIFInstrumentUpdateDetails(formData).subscribe({
        next: (data: any) => {
          const result = data.item1[0]['msg'];
          if (result === 'ok') {
            swal.fire({
              title: 'Uploaded the Document',
              text: 'Document uploaded successfully!',
              icon: 'success',
              showConfirmButton: true,
            })
              .then(() => {
                window.location.reload();
              });
          } else if (result === 'Failed') {
            swal.fire({
              title: 'Failed to Upload',
              text: result,
              icon: 'error',
              timer: 2000,
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
            showConfirmButton: false,
          });
        },
        complete: () => {

        },
      });
    }
  }


}
