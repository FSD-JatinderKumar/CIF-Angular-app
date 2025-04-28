import { FormBuilder } from '@angular/forms';
import {  ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DOCUMENT, Location } from '@angular/common';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-payment-response-page',
  templateUrl: './payment-response-page.component.html',
  styleUrls: ['./payment-response-page.component.scss']
})
export class PaymentResponsePageComponent implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;
  TypeId: any = 'CIF';

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
  PaymentDetails: any[] = [];
  PaymentDetailsX: any[] = [];

  currentPage = 1;
  itemsPerPage = 5; //
  tmpsPaymentDetails: any[] = [];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  MobileNo: any;
  supervisorName: any;
  departmentName: any;
  candidateName: any;
  paymentData: any;
  ResponseUrl: any;
  constructor(
    private CIFwebService: LpuCIFWebService, private location: Location,
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
  id: any; status: any; type: any; transactionNo: any; hashedValue: any; course: any; keyNote: any;
  getParams(): void {
    // const params = this.route.snapshot.params;
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.status = params.get('status');
      this.type = params.get('type');
      this.transactionNo = params.get('transactionNo');
      this.hashedValue = params.get('hashedValue');
      this.course = params.get('Course');
      this.keyNote = params.get('KeyNote');
      const formData = new FormData();
      formData.append('Id', this.id);
      formData.append('Status', this.status);
      formData.append('Type', this.type);
      formData.append('TransactionNo', this.transactionNo);
      formData.append('Course', this.course);
      formData.append('KeyNote', this.keyNote);
      formData.append('HashedValue', this.hashedValue);

      var result;
      this.CIFwebService.GetDecodePaymentStatusDetails(formData).subscribe({
        next: data => {
          result = data;
          // console.log("return encoded "+JSON.stringify(result));

          if (result.status == 'failure') {
            Swal.fire({
              title: 'Payment Failed ',
              // text: 'Payment URL not found!',
              icon: 'error',
            });
          }
          else {
            Swal.fire({
              title: 'Payment Made Successfully',
              // text: 'Payment URL not found!',
              icon: 'success',
            });
          }
        },
      });
    });
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const queryParamLength = params.keys.length;
      if (queryParamLength > 0) {
        this.getParams();
      }
    });
  }

}
