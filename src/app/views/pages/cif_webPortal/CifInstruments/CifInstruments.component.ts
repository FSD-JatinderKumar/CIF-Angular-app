import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';


import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { Specification } from './specification.model';
import { ColumnMode } from '@swimlane/ngx-datatable';

import { DOCUMENT } from '@angular/common';


@Component({
    selector: 'app-CifInstruments',
    templateUrl: './CifInstruments.component.html',
    styleUrls: ['./CifInstruments.component.scss'],
    standalone: false
})
export class CifInstrumentsComponent implements OnInit {
    ColumnMode = ColumnMode; columns: any; loadingIndicator = false; headHtmlData: any[] = []; p: any = 1; perPage: any = 5;
    @ViewChild('table') table: ElementRef;
    displayedColumns: string[] = [
        'instrumentName', 'analysisType', 'analysisCharges', 'noOfSamples',
        'totalCharges', 'remarks', 'bookingRequestDate', //'bookingrequestDate'
    ];
    instrumentStatus: string = '';  // Variable to hold the instrument status message
    isInstrumentActive: boolean = false;
    specifications: Specification[] = [];  // Ensure this is properly typed
    cifInstrumentsDataData: any[] = [];
    ResultData: any[] = []; currentPage = 1; itemsPerPage = 10; //
    tmpscifInstrumentsDataData: any[] = []; tmpsResultData: any[] = [];
    InstrumentId: any; instrumentName: any = ''; UserRole: any; UserId: any; uploadEnabled: boolean; Remarks: any; dataSource: any;
    ServerUrl: any;
    Description: any;
    ImageUrl: any;
    categoryId: number;
    constructor(
        private CIFwebService: LpuCIFWebService,
        private storageService: StorageService,
        private authService: AuthService,
        private fb: FormBuilder, private cdRef: ChangeDetectorRef,
        @Inject(DOCUMENT) document: Document,
        private modalService: NgbModal,private cdr: ChangeDetectorRef ,
        private AuthSession: LoginSessionService,
        private router: Router, private route: ActivatedRoute,
        private cookieService: CookieService) { }

        // this.ServerUrl = 'https://files.lpu.in/umsweb/MOUDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
    ngOnInit(): void {
        this.getAllInstruments();
        // this.route.paramMap.subscribe(params => {
        //     this.InstrumentId = Number(params.get('id'));
        //     const TestIName = params.get('Name');
        //     this.categoryId = Number(params.get('categoryId'));
        //     this.selectedInstrument = this.tmpscifInstrumentsDataData.find(
        //         instrument => instrument.id == this.InstrumentId && instrument.categoryId == this.categoryId
        //     );
        //     this.fetchSpecifications(this.categoryId, this.InstrumentId)
        // });
        this.route.paramMap.subscribe((params) => {
            this.selectedInstrument = this.InstrumentId = Number(params.get('id'));
            this.categoryId = Number(params.get('categoryId'));
            if (this.InstrumentId && this.categoryId) {
              this.fetchSpecifications(this.categoryId, this.InstrumentId);
            }
          });
    }
    getAllInstruments() {
        this.CIFwebService.GetAllInstrumentsData().subscribe({
            next: response => {
                if (response.item1 && response.item1.length > 0) {
                    this.cifInstrumentsDataData = response.item1;
                    // alert(JSON.stringify(this.cifInstrumentsDataData))
                    this.dataSource = response.item1;
                    this.tmpscifInstrumentsDataData = response.item1;
                    this.headHtmlData = this.tmpscifInstrumentsDataData[0];
                    this.columns = Object.keys(this.tmpscifInstrumentsDataData[0]);
                    this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
                    this.columns.push()
                    this.loadingIndicator = false;
                }
                else {
                    this.cifInstrumentsDataData = [];
                }
            },
            error: err => {
                console.log(err)
            }
        });
    }
    selectedInstrument: any = null;


    fetchSpecifications(categoryId: any, id: any): void {
        this.InstrumentId = id;
        this.CIFwebService.fetchSpecifications().subscribe({
            next: (response: any) => {
                if (response.item1 && Array.isArray(response.item1) && response.item1.length > 0) {
                    const allSpecifications: Specification[] = response.item1;
                    const activeInstrument = this.cifInstrumentsDataData.some(
                        (x: { isActive: boolean, id: any }) => x.isActive === true && x.id === this.InstrumentId
                    );

                    var instrument = this.cifInstrumentsDataData.find(
                        (x: { id: any, instrumentName: string }) => x.id == this.InstrumentId
                    );

                    this.instrumentName = instrument.instrumentName;
                    this.ImageUrl = instrument.imageUrl;
                    this.Description = instrument.description;

                    this.isInstrumentActive = activeInstrument == true ? true : false;

                    this.specifications = allSpecifications.filter(
                        (spec: Specification) => spec.categoryId === categoryId
                    );

                    this.isInstrumentActive= true;

                    this.cdr.detectChanges();
                } else {
                    this.specifications = [];
                }
            },
            error: (err) => {
                console.error('Error fetching specifications:', err);
            }
        });
    }

    handleClick(instrument: any): void {
        if (!instrument) {
            // console.error('Instrument is undefined');
            return;
        }

        if (!instrument.isActive) {
            // console.log('Instrument is inactive.');
            return;
        }

        this.fetchSpecifications(instrument.categoryId, instrument.id);
    }

    @ViewChild('chargesModal') chargesModal!: ElementRef;
    openChargesModal(id: any): void {
        this.getChargesDetails(id);
        this.modalService.open(this.chargesModal, { size: 'sm' }).result.then(
            (result: string) => {
                console.log("Modal closed" + result);
            }
        ).catch((res: any) => { });
    }
    cifInstrumentsCharges: any; tmpscifInstrumentsCharges: any;
    getChargesDetails(Id: any) {
        this.CIFwebService.GetChargesDetails(Id).subscribe({
            next: response => {
                if (response.item1 && response.item1.length > 0) {
                    this.cifInstrumentsCharges = response.item1;
                    // console.log(JSON.stringify(this.cifInstrumentsCharges))
                    this.dataSource = response.item1;
                    this.tmpscifInstrumentsCharges = response.item1;
                    this.headHtmlData = this.tmpscifInstrumentsCharges[0];
                    this.columns = Object.keys(this.tmpscifInstrumentsCharges[0]);
                    this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
                    this.columns.push()
                    this.loadingIndicator = false;
                }
                else {
                    this.cifInstrumentsCharges = [];
                }
            },
            error: err => {
                console.log(err)
            }
        });
    }


    navigateToLogin(): void {
        this.modalService.dismissAll();
        this.router.navigate(['/Login']);
    }
}
