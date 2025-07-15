import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from "simple-datatables";
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DOCUMENT } from '@angular/common';
 
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
 
 
 
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { warn } from 'console';
import { FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.scss'],
})
export class HomePageComponent implements OnInit {

  ResultData: any[] = []; currentPage = 1; itemsPerPage = 10; InstrumentsDataData: any[] = [];
  tmpsInstrumentsDataData: any[] = []; tmpsResultData: any[] = [];
  InstrumentId: any; instrumentName: any = ''; UserRole: any; UserId: any; uploadEnabled: boolean; Remarks: any; dataSource: any;
  Description: any; ImageUrl: any;
  ColumnMode = ColumnMode; columns: any; loadingIndicator = false; headHtmlData: any[] = []; p: any = 1; perPage: any = 5;
  @ViewChild('table') table: ElementRef;
  loadingStates: boolean[] = [];  ServerUrl: any;   isLoading: boolean = true;  loadedCount: number = 0;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private router: Router, private route: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.getAllInstruments();
  }
  openSampleInstructions() {
    swal.fire({
      title: 'Send Samples at Following Address :',
      html: `
           <address>
            <div class="contact-text">
            Central Instrumentation Facility (CIF) <br/>
            Lovely Professional University <br/>
            Block-38, Room No.106 <br/>
            Jalandhar - Delhi G.T. Road, <br/>
             Phagwara, Punjab (India) - 144411 <br/>
            <a href="tel:+911824444021">+91 1824-444021</a><br>
            cif@lpu.co.in<br>
            </div>
           </address>`,
      icon: 'info'
    });
 
   
 }
  goto(val: any): void {
    this.router.navigateByUrl(val);
  }
  VisitUrl(Sufix: any, name: any, Id: any, catId: any) {
    this.router.navigateByUrl(Sufix + '/' + name + '/' + Id + '/' + catId);
  }
  onImageLoad(index: number): void {
    this.loadingStates[index] = false;  
  }

  onImageError(event: any, index: number): void {
    event.target.src = 'path/to/error/image.jpg'; 
    this.loadingStates[index] = false;
  }

  getAllInstruments(): void {
    this.CIFwebService.GetAllInstrumentsData().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentsDataData = response.item1;
          this.tmpsInstrumentsDataData = response.item1.slice(0, 8);
          this.loadingStates = Array(this.tmpsInstrumentsDataData.length).fill(true); // Initialize loading states
        } else {
          this.InstrumentsDataData = [];
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
