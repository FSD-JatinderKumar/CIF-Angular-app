// import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { UntypedFormGroup, UntypedFormBuilder, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
// import { AuthService } from 'src/app/_services/auth.service';
// import { LoginSessionService } from 'src/app/_services/login-session.service';
// import { ObpAutoAssignService } from 'src/app/_services/obpAuto-assign';
// import { StorageService } from 'src/app/_services/storage.service';

// @Component({
//   selector: 'app-auto-assign-metric',
//   templateUrl: './auto-assign-metric.component.html',
//   styleUrls: ['./auto-assign-metric.component.scss']
// })
// export class AutoAssignMetricComponent implements OnInit , AfterViewInit{


//   @ViewChild('headerWrapper') headerWrapper!: ElementRef<HTMLDivElement>;
//   @ViewChild('bodyWrapper') bodyWrapper!: ElementRef<HTMLDivElement>;
//   ngAfterViewInit(): void {
//     this.syncScroll();
//   }
//   syncScroll(): void {
//     const header = this.headerWrapper.nativeElement;
//     const body = this.bodyWrapper.nativeElement;

//     body.addEventListener('scroll', () => {
//       header.scrollLeft = body.scrollLeft;
//     });
//   }
//   metricId: any;  ResultQuery: any; sessionId: any ='Select'; items: any;
//   AutoAllocated: any='false'; IsIncentiveBased: any='false'; ProofType: any;
//   AllocationType: any='false';  IsSanctioned: any='false';   StageWise: any='false';
//   StreamWise: any ='false';   DetailedQuery: any;  userName: any; SchoolWise: any='false';   PageUrl: any;   Remarks: any; 
//   DetailedQuerys: any
//   validationForm1: UntypedFormGroup;
//   validationForm2: UntypedFormGroup;

//   isForm1Submitted: Boolean;
//   isForm2Submitted: Boolean;

//   @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
//   OnMetricData: any; tmpsOnMetricData: any;
//   dataSource: any;
//   headHtmlData: any;
//   columns: string[];
//   loadingIndicator: boolean;

//   constructor(public formBuilder: UntypedFormBuilder,
//     private CIFwebService: ObpAutoAssignService,
//     private storageService: StorageService,
//     private authService: AuthService,
//     private fb: FormBuilder, private cdRef: ChangeDetectorRef,
//     private modalService: NgbModal,private cdr: ChangeDetectorRef ,
//     private AuthSession: LoginSessionService,
//     private router: Router, private route: ActivatedRoute,
//     ) { }
//   // constructor(public formBuilder: UntypedFormBuilder) { }

//   getDropdownData(): void {
//     this.CIFwebService.GetAllOBPPlannerSessions().subscribe({
//       next: response => {
//         if (response.item1 ) {
//           this.items = response.item1;  
//           console.log(JSON.stringify(this.items))
//         }
//       }
//     })
//   }

  
//   ngOnInit(): void { 
//     this.getDropdownData();
//     this.validationForm1 = this.fb.group({
//       metricId : ['', Validators.required],
//       sessionId : ['Select', Validators.required],
//       ResultQuery : ['', Validators.required],
//       AutoAllocated : [0, Validators.required],
//       AllocationType : [0, Validators.required],
//       IsIncentiveBased: [0, Validators.required],
//       IsSanctioned : [0, Validators.required],
//       StageWise : ['0', Validators.required],
//       StreamWise: [false, Validators.required],
//       SchoolWise: ['0', Validators.required],
//       PageUrl: ['',Validators.required],
//       Remarks: ['',Validators.required],
//       DetailedQuerys: ['Type Query Optional'],
//       ProofType: ['',Validators.required],
//       userName : ['', Validators.required]
//     });

 

//     this.isForm1Submitted = false;

//   }
  
//   finishFunction() {
//     alert('Successfully Completed');
//   }

 
//   get form1() {
//     return this.validationForm1.controls;
//   }
 

 
//   form1Submit() {
//     if(this.validationForm1.valid) {
//       const formData = new FormData();
//       formData.append('PlannerSessionID', this.sessionId);
//       formData.append('MetricId', this.metricId);
//       formData.append('ResultQuery', this.ResultQuery);
//       formData.append('AutoAllocation', this.AutoAllocated);
//       formData.append('AllocationDeptType', this.AllocationType);
//       formData.append('IsIncentiveBased', this.IsIncentiveBased);
//       formData.append('IsStageWiseAllocation', this.StageWise);
//       formData.append('IsStreamWise', this.StreamWise);
//       formData.append('IsSchoolWise', this.SchoolWise);
//       formData.append('PageUrl', this.PageUrl);
//       formData.append('Remarks', this.Remarks);
//       formData.append('DetailedQuery', this.DetailedQuerys);
//       formData.append('QueryHandlerUID', this.userName);
//       formData.append('TypeOfProof', this.ProofType);


//       formData.forEach((value, key) => {
//         console.log(`${key}: ${value}`);
//       });

// // "metricId":"15545","sessionId":"9","ResultQuery":"select * from ConstructionOBPMetricEngineer where MetricId=7278",
// // "AutoAllocated":"0","AllocationType":"0","IsIncentiveBased":"0","IsSanctioned":"0","StageWise":"0","StreamWise":"0","SchoolWise":"0","PageUrl":"Page Url","Remarks":"Type Query Optional","DetailedQuerys":"Type Query Optional","ProofType":"test case s","userName":"43254"

      
//       console.log('Form Values:', JSON.stringify(this.validationForm1.value));
//       alert("YES")
//     }
//     this.isForm1Submitted = true;
//   }
 

//   OnMetricChange(event:any){
//       this.CIFwebService.GetObpMetricDetails(this.metricId).subscribe({
//           next: response => {
//               if (response.item1 && response.item1.length > 0) {
//                   this.OnMetricData = response.item1;
//                   this.dataSource = response.item1;
//                   this.tmpsOnMetricData = response.item1;
//                   this.headHtmlData = this.tmpsOnMetricData[0];
//                   this.columns = Object.keys(this.tmpsOnMetricData[0]);
//                   this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
//                   this.columns.push()

//                   setTimeout(() => {

//                     var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
//                     var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
//                     if (wrapper1) {
//                       wrapper1.style.display = 'block';
//                   }
//                   if (wrapper2) {
//                       wrapper2.style.display = 'block';
//                   }
//                     wrapper1.onscroll = function () {
//                       wrapper2.scrollLeft = wrapper1.scrollLeft;
//                     };
//                     wrapper2.onscroll = function () {
//                       wrapper1.scrollLeft = wrapper2.scrollLeft;
//                     };
          
//                   }, 1000);
          
//                   this.loadingIndicator = false;
//               }
//               else {
//                   this.OnMetricData = [];
//                   var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
//                   var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
//                   if (wrapper1) {
//                     wrapper1.style.display = 'none';
//                 }
//                 if (wrapper2) {
//                     wrapper2.style.display = 'none';
//                 }

//               }
//           },
//           error: err => {
//               console.log(err)
//           }
//       });
//   }
//   tmpsQueryResult: any[]=[]; QueryResult: any[] = [];  
//   columnss: string[] = [];  
//   pagedQueryResult: any[] = [];  
//   pageSize = 5;  
//   currentPage = 1; 
//   totalPages = 0; // Total number of pages

//   GetResult() {
//     this.loadingIndicator = true;
//     this.CIFwebService.GetOBPQueryResultsData(this.ResultQuery).subscribe({
//       next: (response) => {
//         if (response && response.length > 0) {
//           this.QueryResult = response;

//           this.columnss = Object.keys(this.QueryResult[0]);
//           this.totalPages = Math.ceil(this.QueryResult.length / this.pageSize);
//           this.updatePagedQueryResult();
//         } else {
//           this.QueryResult = [];
//         }
//         this.loadingIndicator = false; // Hide loader
//       },
//       error: (err) => {
//         console.error('Error fetching data:', err);
//         this.QueryResult = []; // Handle error case
//         this.columnss = [];
//         this.loadingIndicator = false; // Hide loader
//       }
//     });
   
//   }

//   updatePagedQueryResult(): void {
//     const startIndex = (this.currentPage - 1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.pagedQueryResult = this.QueryResult.slice(startIndex, endIndex);
//   }

//   // Handle page change
//   onPageChange(page: number): void {
//     if (page > 0 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePagedQueryResult();
//     }
//   }
  
// }
