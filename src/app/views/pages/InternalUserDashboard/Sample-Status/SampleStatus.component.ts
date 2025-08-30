import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import * as XLSX from 'xlsx';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';

import { ColumnMode } from '@swimlane/ngx-datatable';

import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-SampleStatus',
  templateUrl: './SampleStatus.component.html',
  styleUrls: ['./SampleStatus.component.scss']
})
export class SampleStatusComponent implements OnInit {

    @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
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
      'totalCharges', 'remarks', 'SamplesRequestDate', //'SamplesrequestDate'
    ];
    SamplesCase: any;
    SamplesStatusData: any[] = [];
    ResultData: any[] = [];
    currentPage = 1;
    itemsPerPage = 10; //
    tmpsSamplesStatusData: any[] = [];
    tmpsResultData: any[] = [];
    InstrumentId: any;
    UserRole: any;
    UserId: any;
    uploadEnabled: boolean;
    Remarks: any;
    dataSource: any;
    ServerUrl: any;
  
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
      this.ServerUrl ='https://files.lpu.in/umsweb/CIFDocuments/';// 'http://172.19.2.52/umsweb/webftp/MOUDocuments/';
      const GetCookieData = this.cookieService.get('InternalUserAuthData');
      const retrievedCookies = JSON.parse(GetCookieData);
      this.UserRole = retrievedCookies.UserRole;
      this.UserId = retrievedCookies.EmailId;
      this.getMySampleStatus(this.UserId)
    }
  
    searchQuery: string = ''; // Property to store the search query
  
    search() {
      const query = this.searchQuery.toLowerCase();
      this.tmpsSamplesStatusData = this.SamplesStatusData.filter(item => {
        return Object.values(item).some(val =>
          String(val).toLowerCase().includes(query)
        );
      });
    }
  
  
    get filteredSamplesStatusData(): any[] {
      // If search query is empty, return all data
      if (!this.searchQuery.trim()) {
        return this.SamplesStatusData;
      }
      const searchTerm = this.searchQuery.toLowerCase();
      return this.SamplesStatusData.filter((Samples: { instrumentName: string; analysisType: string; }) =>
        Samples.instrumentName.toLowerCase().includes(searchTerm) || Samples.analysisType.toLowerCase().includes(searchTerm)
      );
    }
    getMySampleStatus(UID: any) {
      this.CIFwebService.GetSampleStatus(this.UserId).subscribe({
        next: response => {
          if (response.item1 && response.item1.length > 0) {
            this.SamplesStatusData = response.item1;
            this.dataSource = response.item1;
            console.log(JSON.stringify(this.SamplesStatusData))
            this.tmpsSamplesStatusData = response.item1;
            this.headHtmlData = this.tmpsSamplesStatusData[0];
            this.columns = Object.keys(this.tmpsSamplesStatusData[0]);
            this.columns = this.columns.filter((item: any) => item !== 'ResultFile' && item !== 'userId' && item !== 'id' && item !== 'analysisId');
            this.columns.push()
            this.loadingIndicator = false;
          }
          else {
            this.SamplesStatusData = [];
          }
        },
        error: err => {
          console.log(err)
        }
      });
    }
  
    getTotalPages() {
      return Math.ceil(this.tmpsSamplesStatusData.length / this.itemsPerPage);
    }
  
    getCurrentPageData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.tmpsSamplesStatusData.slice(startIndex, endIndex);
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
      const fileName = 'Samples_Details_report.xlsx';
      const exportedData = this.SamplesStatusData.map(item => ({
        BookingId: item.bookingId,
        InstrumentName: item.instrumentName,
        AssignedTo: item.assignedTo.split(' ').slice(0, -1).join(' ') ,
        AssignedDate: item.assignedOn,
        Samples: item.noOfSamples,
        RequestDate: item.bookingRequestDate ,
  
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
  
 
}
