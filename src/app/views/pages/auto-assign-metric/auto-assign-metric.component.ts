import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { ObpAutoAssignService } from 'src/app/_services/obpAuto-assign';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-auto-assign-metric',
  templateUrl: './auto-assign-metric.component.html',
  styleUrls: ['./auto-assign-metric.component.scss']
})
export class AutoAssignMetricComponent implements OnInit , AfterViewInit{


  @ViewChild('headerWrapper') headerWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('bodyWrapper') bodyWrapper!: ElementRef<HTMLDivElement>;
  ngAfterViewInit(): void {
    this.syncScroll();
  }
  syncScroll(): void {
    const header = this.headerWrapper.nativeElement;
    const body = this.bodyWrapper.nativeElement;

    body.addEventListener('scroll', () => {
      header.scrollLeft = body.scrollLeft;
    });
  }
  AllocationDeptType: any;
  AllocationType: any='false';
  AutoAllocated: any='false';
  DetailedQuerys: any;
  EntryBy: any='31309';
  IsIncentiveBased: any='false';
  SchoolWise: any='false';
  StreamWise: any ='false';  
  metricId: any;
  PageUrl: any;
  sessionId: any ='Select'; 
  QueryHandlerUID: any='31309';
  ResultQuery: any; 
  ProofType: any;
  isLoginFailed: boolean = false; 
  items: any;
   
  IsSanctioned: any='false';   StageWise: any='false';
  DetailedQuery: any;  userName: any;    Remarks: any; 
  


  validationForm1: UntypedFormGroup;
  validationForm2: UntypedFormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  OnMetricData: any; tmpsOnMetricData: any;
  dataSource: any;
  headHtmlData: any;
  columns: string[];
  loadingIndicator: boolean;

  constructor(public formBuilder: UntypedFormBuilder,
    private CIFwebService: ObpAutoAssignService,
    private storageService: StorageService,
    private authService: AuthService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,private cdr: ChangeDetectorRef ,
    private AuthSession: LoginSessionService,
    private router: Router, private route: ActivatedRoute,
    ) { debugger ; 
      console.log("Loading")
    }

  getDropdownData(): void {
    this.CIFwebService.GetAllOBPPlannerSessions().subscribe({
      next: response => {
        if (response.item1 ) {
          this.items = response.item1;  
          // console.log(JSON.stringify(this.items))
        }
      }
    })
  }

  
  ngOnInit(): void { 
    debugger;
    let loginName = this.route.snapshot.params['loginName'];
    if (loginName != '' && loginName != undefined) {
      this.getToken(loginName);
    }
    this.LoadForm();
    this.getDropdownData();
    
  }
  

  getToken(id: any) {
    debugger;
    this.authService.loginTemp(id).subscribe({
      next: data => {
        this.storageService.saveUser(data);
       
      },
      error: _err => {
        this.LoginFailed(_err);
      }
    });
  }
LoadForm()
{
  this.validationForm1 = this.fb.group({
    metricId : ['', Validators.required],
    sessionId : ['Select', Validators.required],
    ResultQuery : ['', Validators.required],
    AutoAllocated : [0, Validators.required],
    AllocationType : [0, Validators.required],
    IsIncentiveBased: [false, Validators.required],
    IsSanctioned : [false, Validators.required],
    StageWise : [0, Validators.required],
    StreamWise: [false, Validators.required],
    SchoolWise: [false, Validators.required],
    PageUrl: ['',Validators.required],
    Remarks: ['',Validators.required],
    DetailedQuerys: ['Type Query Optional'],
    ProofType: ['',Validators.required],
    userName : ['', Validators.required]
  });
  this.isForm1Submitted = false;
}
  LoginFailed(_NewError: any) {
    this.isLoginFailed = true;
    swal.fire({
      title: 'Login Failed',
      text: 'Login details are Invalid!',
      icon: 'warning',
    })
    const element = document.getElementById('JournalForm');
    if (element) {
      element.hidden = true;
    }
  }
  finishFunction() {
    alert('Successfully Completed');
  }

 
  get form1() {
    return this.validationForm1.controls;
  }
 

 
  form1Submit() {
    // debugger;
    if(this.validationForm1.valid) {
      const formDatax = new FormData();
      formDatax.append('PlannerSessionID', this.sessionId);
      formDatax.append('MetricId', this.metricId);
      formDatax.append('ResultQuery', this.ResultQuery);
      formDatax.append('AutoAllocation', this.AutoAllocated);
      formDatax.append('AllocationDeptType', this.AllocationType);
      formDatax.append('IsIncentiveBased', this.IsIncentiveBased);
      formDatax.append('IsStageWiseAllocation', this.StageWise);
      formDatax.append('IsStreamWise', this.StreamWise);
      formDatax.append('IsSchoolWise', this.SchoolWise);
      formDatax.append('PageUrl', this.PageUrl);
      formDatax.append('Remarks', this.Remarks);
      formDatax.append('DetailedQuery', this.DetailedQuerys);
      formDatax.append('QueryHandlerUID', this.userName);
      formDatax.append('TypeOfProof', this.ProofType);
      formDatax.append('EntryBy', this.userName);

      // formDatax.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });

// "metricId":"15545","sessionId":"9","ResultQuery":"select * from ConstructionOBPMetricEngineer where MetricId=7278",
// "AutoAllocated":"0","AllocationType":"0","IsIncentiveBased":"0","IsSanctioned":"0","StageWise":"0","StreamWise":"0","SchoolWise":"0","PageUrl":"Page Url","Remarks":"Type Query Optional","DetailedQuerys":"Type Query Optional","ProofType":"test case s","userName":"43254"

      
      // console.log('Form Values',typeof(formDatax));
      // alert("YES")
     

      this.CIFwebService.CallWebApiInsertData(formDatax).subscribe({
        next: (data) => {
          const result = data.item1[0]['ResultQueryMessage'];
          if (result === 'Success') {
            swal.fire({
              title: 'Action Planned Stored Successfully!',
              // text: '',
              icon: 'success'
            }).then(() => {
              window.location.reload();
            });
          } else if (result === 'Already Done') {
            swal.fire({
              title: 'OBP is already Planned ',
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
    }
    this.isForm1Submitted = true;
  }
 

  OnMetricChange(event:any){
      this.CIFwebService.GetObpMetricDetails(this.metricId).subscribe({
          next: response => {
              if (response.item1 && response.item1.length > 0) {
                  this.OnMetricData = response.item1;
                  this.dataSource = response.item1;
                  this.tmpsOnMetricData = response.item1;
                  this.headHtmlData = this.tmpsOnMetricData[0];
                  this.columns = Object.keys(this.tmpsOnMetricData[0]);
                  this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
                  this.columns.push()

                  setTimeout(() => {

                    var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
                    var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
                    if (wrapper1) {
                      wrapper1.style.display = 'block';
                  }
                  if (wrapper2) {
                      wrapper2.style.display = 'block';
                  }
                    wrapper1.onscroll = function () {
                      wrapper2.scrollLeft = wrapper1.scrollLeft;
                    };
                    wrapper2.onscroll = function () {
                      wrapper1.scrollLeft = wrapper2.scrollLeft;
                    };
          
                  }, 1000);
          
                  this.loadingIndicator = false;
              }
              else {
                  this.OnMetricData = [];
                  var wrapper1 = (<HTMLInputElement>document.getElementById('wrapper1'));
                  var wrapper2 = (<HTMLInputElement>document.getElementById('wrapper2'));
                  if (wrapper1) {
                    wrapper1.style.display = 'none';
                }
                if (wrapper2) {
                    wrapper2.style.display = 'none';
                }

              }
          },
          error: err => {
              console.log(err)
          }
      });
  }
  tmpsQueryResult: any[]=[]; QueryResult: any[] = [];  
  columnss: string[] = [];  
  pagedQueryResult: any[] = [];  
  pageSize = 5;  
  currentPage = 1; 
  totalPages = 0; // Total number of pages

  GetResult() {
    this.loadingIndicator = true;
    this.CIFwebService.GetOBPQueryResultsData(this.ResultQuery).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.QueryResult = response;
          this.columnss = Object.keys(this.QueryResult[0]);
          this.totalPages = Math.ceil(this.QueryResult.length / this.pageSize);
          this.updatePagedQueryResult();
        } else {
          this.QueryResult = [];
        }
        this.loadingIndicator = false; // Hide loader
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.QueryResult = []; // Handle error case
        this.columnss = [];
        this.loadingIndicator = false; // Hide loader
      }
    });
   
  }

  updatePagedQueryResult(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedQueryResult = this.QueryResult.slice(startIndex, endIndex);
  }

  // Handle page change
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedQueryResult();
    }
  }
  
}
