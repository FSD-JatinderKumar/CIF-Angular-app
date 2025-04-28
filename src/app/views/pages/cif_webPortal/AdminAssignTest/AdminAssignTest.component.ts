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
import { date } from 'ngx-custom-validators/src/app/date/validator';

@Component({
  selector: 'app-AdminAssignTest',
  templateUrl: './AdminAssignTest.component.html',
  styleUrls: ['./AdminAssignTest.component.scss']
})
export class AdminAssignTestComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;


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
  AllBookingTestsData: any[] = [];

  currentPage = 1;
  itemsPerPage = 10; //
  tmpsAllBookingTestsData: any[] = [];
  InstrumentId: any;
  UserRole: any;
  AssignedTo: any;
  serverUrl: string;
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
    this.serverUrl = 'https://files.lpu.in/umsweb/MOUDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    // this.getSessionDetails();
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.getAllPaymentDetails()
  }

  searchQuery: string = ''; // Property to store the search query

  get filteredAllBookingTestsData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.AllBookingTestsData;
    }

    // Otherwise, filter data based on search query
    const searchTerm = this.searchQuery.toLowerCase();
    return this.AllBookingTestsData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)
    );
  }

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsAllBookingTestsData = this.AllBookingTestsData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }
  getAllPaymentDetails() {
    this.CIFwebService.GetAllBookingTests().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.AllBookingTestsData = response.item1;
          this.dataSource = response.item1;

          this.tmpsAllBookingTestsData = response.item1;

          this.headHtmlData = this.tmpsAllBookingTestsData[0];
          this.columns = Object.keys(this.tmpsAllBookingTestsData[0]);
          // this.columns = this.columns.filter((item: any) => item !== 'bookingRequestDate' && item !== 'instrumentId' && item !== 'id' && item !== 'analysisId');
          // debugger;
          this.columns.push()
          this.loadingIndicator = false;


          // console.log("AllBookingTestsData  Data  " + JSON.stringify(this.tmpsAllBookingTestsData))
        }
        else {
          this.AllBookingTestsData = [];
        }
      },
      error: err => {
        console.log(err)
      }
    });
  }

  // Calculate total pages based on the number of items and items per page
  getTotalPages() {
    return Math.ceil(this.tmpsAllBookingTestsData.length / this.itemsPerPage);
  }

  // Function to get the current page of data
  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsAllBookingTestsData.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Function to go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  exportToExcel(): void {
    const fileName = 'Assigned_Details_report.xlsx';
    const exportedData = this.AllBookingTestsData.map(item => ({
      EmailId: item.userEmailId,
      CanidateName: item.candidateName,
      Instrument: item.instrumentName,
      SampleCount: item.noOfSamples,
      BookingDate: item.bookingRequestDate,
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


  openPaymentModal(a: any) {
    this.BookingCase = a;
    this.modalService.open(this.viewDescModal2, { size: 'sm' }).result.then(
      (result: string) => {
        console.log("Modal closed" + result);
      }
    ).catch((res: any) => { });

  }

  onActivitySelected(event: any): void {
    this.AssignedTo = event.target.value;
    // alert(this.AssignedTo)
  }
  VerifyData(AssignTest: any) {
    // param.Add("", obj.BookingId);
    // param.Add("InstrumentId", obj.InstrumentId);
    // param.Add("UserId", obj.UserId);
    // param.Add("AssignedTo", obj.AssignedTo);
    const formData = new FormData();
    formData.append('BookingId', AssignTest.bookingId);
    formData.append('InstrumentId', AssignTest.instrumentId);
    formData.append('UserId', AssignTest.userEmailId);
    formData.append('AssignedTo', this.AssignedTo);
    // formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    this.CIFwebService.CIFAssignTestToStaff(formData).subscribe({
      next: (data: any) => {
        const result = data.item1[0]['msg'];
        if (result === 'Success') {
          swal.fire({
            title: 'Action Planned Stored Successfully!',
            // text: '',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        } else if (result === 'Failed') {
          swal.fire({
            title: 'Test is already Assigned ',
            icon: 'error'
          }).then(() => {
            window.location.reload();
          });
        } else {
          swal.fire({
            title: 'Something Went Wrong, Try again later',
            icon: 'error'
          }).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error: any) => {
        swal.fire({
          title: 'Error',
          text: 'Failed to Upload.',
          icon: 'error'
        }).then(() => {
          window.location.reload();
        });
      },
      complete: () => {
      }
    });

    // "bookingId":"600046","instrumentId":"100011","analysisId":"300026","analysisCharges":"350.00","noOfSamples":"5","totalCharges":"1750.00","remarks":"test cases","bookingRequestDate":"29 Jul 2024","instrumentName":"Powder XRD (Bruker D8 Advance)","analysisType":"Microstructural Studies","userEmailId":"testuser@gmail.com","supervisorName":"Test supvisor","candidateName":"Tet User","fileName":null},{"bookingId":"600046","instrumentId":"100011","analysisId":"300026","analysisCharges":"350.00","noOfSamples":"5","totalCharges":"1750.00","remarks":"test cases","bookingRequestDate":"29 Jul 2024","instrumentName":"Powder XRD (Bruker D8 Advance)","analysisType":"Microstructural Studies","userEmailId":"testuser@gmail.com","supervisorName":"pawan deep","candidateName":"rajan user","fileName":null},
  }
  downloadFile(fileName: string): void {
    const url = this.serverUrl + fileName;
    window.open(url, '_blank');
  }
}
// export class PendingPaymentsComponent implements OnInit {
//   sessionData : any [] = [] ;
//   constructor(
//     private CIFwebService: LpuCIFWebService,
//     private storageService: StorageService,
//     private authService: AuthService,
//     public formBuilder: UntypedFormBuilder,
//     private AuthSession: LoginSessionService,
//     private fb: FormBuilder,
//     private router: Router, private route: ActivatedRoute
//   ) { }

//   ngOnInit(): void {
//     this.getSessionDetails();
//     // (<HTMLInputElement>document.getElementById('imgLogo')).style.width = '164px';
//     this.getInstrumentData();
//    if(this.user_Email==null || this.user_Email?.length< 2 )
//     {
//       this.user_Email='jane.smith@example.com';
//       console.log("set the statis value "+ this.user_Email)
//     }
//   }


//   InstrumentData: any; AnalysisData: any;
//   formdata = new FormGroup({
//     instrument: new FormControl('0', Validators.required),
//     Typeofanalysis: new FormControl('0', Validators.required),
//     Duration: new FormControl('Select', Validators.required),
//     charge: new FormControl(''),
//     sampleno: new FormControl('', Validators.required),
//     totalamount: new FormControl(''),
//     remark: new FormControl('')
//   })

//   showNoDataFoundMessage: boolean;
//   selectedId: number;
//   selectedDuration: string;
//   InstrumentId: any;
//   AnalysisId: any;
//   PriceData: any;
//   PriceValue: any;
//   Duration: any;
//   NumberOfSamples: any;
//   totalAmount: any;
//   Remarks: any;
//   user_Email: any;

//   getSessionDetails(){
//     debugger;
//     this.sessionData = this.AuthSession.getSession();
//     for (const session of this.sessionData) {
//       this.user_Email = session[0]['userEmail']
//     }
//   }
//   getInstrumentData() {
//     debugger;
//     this.CIFwebService.GetInstrumentsDetails().subscribe({
//       next: response => {
//         if (response.item1 && response.item1.length > 0) {
//           this.InstrumentData = response.item1;
//           // console.log("InstrumentData Candidate Data  " + JSON.stringify(this.InstrumentData))
//         }
//         else {
//           this.InstrumentData = [];
//         }
//       },
//       error: err => {
//         console.log(err)
//       }
//     });
//   }


//   getAllAnalysis(event: Event) {
//     this.Duration = this.AnalysisId = this.PriceValue = '';
//     const selectElement = event.target as HTMLSelectElement; const selectedValue = selectElement.value;
//     const InstrumentIndex = Array.from(selectElement.options).findIndex(option => option.value === selectedValue);
//     if (InstrumentIndex !== -1) {
//       selectElement.selectedIndex = InstrumentIndex;
//       this.selectedId = parseInt(selectedValue, 10);
//       this.InstrumentId = this.selectedId;
//       this.GetInstrumentIDWiseAnalysisDetails(this.selectedId);
//     }
//   }


//   setAnalysisId(event: Event) {
//     const selectElement = event.target as HTMLSelectElement; const selectedValue = selectElement.value;
//     const AnalysisIndex = Array.from(selectElement.options).findIndex(option => option.value === selectedValue);
//     this.Duration = this.PriceValue = '';
//     if (AnalysisIndex !== -1) {
//       selectElement.selectedIndex = AnalysisIndex;
//       this.selectedId = parseInt(selectedValue, 10);
//       this.AnalysisId = this.selectedId;
//       // console.log("AnalysisId for instrument" + this.AnalysisId + "==" + JSON.stringify(this.AnalysisId))
//     }
//   }
//   GetInstrumentIDWiseAnalysisDetails(selectedId: number) {
//     debugger;
//     this.CIFwebService.GetAnalysisDetails(selectedId).subscribe({
//       next: response => {
//         if (response.item1 && response.item1.length > 0) {
//           this.AnalysisData = response.item1;
//           // console.log("AnalysisData for instrument" + selectedId + "==" + JSON.stringify(this.AnalysisData))
//         }
//         else {
//           this.AnalysisData = [];
//         }
//       },
//       error: err => {
//         console.log(err)
//       }
//     });

//   }

//   getPrice(event: Event) {
//     const selectElement = event.target as HTMLSelectElement; const selectedValue = selectElement.value;
//     const DurationType = Array.from(selectElement.options).findIndex(option => option.value === selectedValue);
//     if (DurationType !== -1) {
//       selectElement.selectedIndex = DurationType;
//       this.selectedDuration = selectedValue;
//       this.CIFwebService.GetDuationAndPrice(this.AnalysisId, 400001, this.selectedDuration).subscribe({
//         next: response => {
//           if (response.item1 && response.item1.length > 0) {
//             this.PriceData = response.item1;
//             this.PriceValue = this.PriceData[0].price;
//             console.log("AnalysisData for Analysis" + this.AnalysisId + "==" + JSON.stringify(this.PriceData) + "Price -= " + this.PriceData[0].price)
//           }
//           else {
//             this.AnalysisData = [];
//             // console.log("AnalysisData Error for Analysis " + this.AnalysisId + "==" + JSON.stringify(this.PriceData))
//           }
//         },
//         error: err => {
//           console.log(err)
//         }
//       });
//     }
//   }

//   calculateAmount() {
//     var CostofTest = this.PriceValue != 'N/A' ? parseInt(this.PriceValue) : 0
//     var NoOfSamples = parseInt(this.NumberOfSamples);
//     // if (NoOfSamples > 5) {
//     //   swal.fire({
//     //     title: 'Maximum 5 Tests are Allowed',
//     //     text: 'Setting 5 as number of Samples!',
//     //     icon: 'warning',
//     //   })
//     //   this.NumberOfSamples = NoOfSamples = 5;
//     // }
//     // // else {
//     this.totalAmount = NoOfSamples * CostofTest;
//     // }
//   }


//   Onsubmit() {
//     debugger;
//     const AnalysisCharge = this.PriceValue === 'N/A' ? 0 : parseInt(this.PriceValue);
//     const TotalPrice = this.totalAmount === 'NA' ? 0 : parseInt(this.totalAmount);
//     const formData = new FormData();
//     formData.append("InstrumentId", this.InstrumentId);
//     formData.append("UserEmailId", this.user_Email);
//     formData.append("AnalysisId", this.AnalysisId);
//     formData.append("AnalysisCharges",AnalysisCharge.toString());
//     formData.append("NoOfSamples", this.NumberOfSamples);
//     formData.append("TotalCharges", TotalPrice.toString());
//     formData.append("Remarks", this.Remarks);
//     // formData.append("RequestDate", this.LoginId);
//     // formData.forEach((value, key) => {
//     //   console.log(key, value);
//     // });
//     var result;
//      this.CIFwebService.addBookingSlot(formData).subscribe({
//       next: data => {
//         result = data.item1[0]['msg']
//         if (result == 'OK') {
//           swal.fire({
//             title: 'Uploaded the Document',
//             text: data.item1[0]['msg'],
//             icon: 'success'
//           }
//           );

//         }
//         else {
//           swal.fire({
//             title: 'Somthing went wrong',
//             text: result,
//             icon: 'error'
//           });
//         }
//         window.location.reload();

//       },
//     });
//   }


// }
