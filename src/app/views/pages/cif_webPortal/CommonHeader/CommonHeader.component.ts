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
// import { ATopHeaderModule } from "../atop-header/atop-header.module";


@Component({
  selector: 'app-CommonHeader',
  templateUrl: './CommonHeader.component.html',
  styleUrls: ['./CommonHeader.component.scss'],
})
export class CommonHeaderComponent implements OnInit {
   
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
    user_Email: any;     UserRole: any; UserId: any;   sessionData: any[] = [];
    Remarks: any;  dataSource: any;  ServerUrl: any;
    getSessionDetails() {
        this.sessionData = this.AuthSession.getSession();
        for (const session of this.sessionData) {
            this.user_Email = session[0]['userEmail']
        }
    }
    ngOnInit(): void {

    }
    goto(val: any) {
        this.router.navigateByUrl(val);
      }
      isNavbarCollapsed: boolean = true;
      toggleNavbar(): void {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
      }
}
