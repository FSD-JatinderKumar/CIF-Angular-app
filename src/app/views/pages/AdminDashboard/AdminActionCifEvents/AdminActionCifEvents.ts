import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';

import { MatTableDataSource } from '@angular/material/table';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-AdminActionInstruments',
  templateUrl: './AdminActionCifEvents.html',
  styleUrls: ['./AdminActionCifEvents.scss']
})
export class AdminActionCifEvents implements OnInit {
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  @ViewChild('ngSelectComponentStream') ngSelectComponentStream: NgSelectComponent;
  @ViewChild('verticalCenteredModal') verticalCenteredModal: TemplateRef<any>;
  @ViewChild('viewDescModal') viewDescModal: TemplateRef<any>;
  // @ViewChild('viewDescModal2') viewDescModal2: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;
  serverUrl: any = 'https://files.lpu.in/umsweb/CIFDocuments/';
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
  InstrumentData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10; // 
  tmpsInstrumentData: any[] = [];
  InstrumentId: any;
  UserRole: any;
  UserId: any;
  uploadEnabled: boolean;
  supervisorName: any;
  departmentName: any;
  candidateName: any;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private modalService: NgbModal, private fb: FormBuilder,
    private AuthSession: LoginSessionService,
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
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.userRole?.length > 0 ? retrievedCookies.userRole : 'Internal User';
    this.user_Email = retrievedCookies.EmailId;
    this.supervisorName = retrievedCookies.SupervisorName;
    this.departmentName = retrievedCookies.DepartmentName;
    this.candidateName = retrievedCookies.CandidateName;

    this.GetAllEventDetails();
    this.LoadNewForm();
  }

  searchQuery: string = '';  

  get filteredInstrumentData(): any[] {
    // If search query is empty, return all data
    if (!this.searchQuery.trim()) {
      return this.InstrumentData;
    }

    // Otherwise, filter data based on search query
    const searchTerm = this.searchQuery.toLowerCase();
    return this.InstrumentData.filter((booking: { instrumentName: string; analysisType: string; }) =>
      booking.instrumentName.toLowerCase().includes(searchTerm) || booking.analysisType.toLowerCase().includes(searchTerm)

    );
  }
  GetAllEventDetails(): void {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllEventDetails().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentData = response.item1;
          this.dataSource = response.item1;
          this.tmpsInstrumentData = response.item1;
          this.headHtmlData = this.tmpsInstrumentData[0];
          this.columns = Object.keys(this.tmpsInstrumentData[0]);

        }
        else {
          this.InstrumentData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });
  }

  search() {
    const query = this.searchQuery.toLowerCase();
    this.tmpsInstrumentData = this.InstrumentData.filter(item => {
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    });
  }

  getTotalPages() {
    return Math.ceil(this.tmpsInstrumentData.length / this.itemsPerPage);
  }

  // Function to get the current page of data
  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tmpsInstrumentData.slice(startIndex, endIndex);
  }

  // Function to go to the next page
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
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // Added on 5-sep-25
  Reason: any;


  DisapproveStatus(rowData: any) {
    swal.fire({
      title: "Reason for Rejection",
      // text: "Disapproval reason",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.Reason = result.value;
        const formData = new FormData();
        formData.append('EventId', rowData.eventId);
        formData.append('DisapprovalReason', this.Reason);
        formData.append('UpdatedBy', this.user_Email);
        this.handleStatusChange(formData);
      } else {
        this.showCancelledSwal();
      }
    });
  }
  private handleStatusChange(formData: FormData) {
    this.CIFwebService.CIFUpdateEventsDetails(formData).subscribe((data: any) => {
      if (data.responseData === 'Cancel') {
        swal.fire(
          'No Change!',
          ' ',
          'error'
        );
      } else {
        swal.fire(
          'Rejected successfully !',
          '',
          'success'
        ).then(() => {
          window.location.reload();
        });
      }
    });
  }

  private showCancelledSwal() {
    swal.fire(
      'Cancelled',
      ' ',
      'error'
    );
  }

  // 6-sep-25
  onSelectFile(a: any) {
    let aa = a;
    // alert(JSON.stringify(a))
    window.open(this.serverUrl + aa.imageUrl, '_blank');
  }

  // 8 sept-25
  @ViewChild('editEventModal') editEventModal: TemplateRef<any>;
  editEvent: any = {};
  selectedFile: File | null = null;

  // Open modal and load selected event
  // openEditModal(eventData: any) {
  //   this.editEvent = { ...eventData }; // clone object
  //   this.selectedFile = null;
  //   this.modalService.open(this.editEventModal, { centered: true, size: 'lg' });
  // }

  openEditModal(eventData: any) {
    this.editEvent = { ...eventData }; // clone object
    this.selectedFile = null;
    // Patch form values
    this.CIFEventRegistration.patchValue({
      EventName: eventData.eventName,
      EventDate: this.formatDateForInput(eventData.eventDate),
      EventDetails: eventData.eventDetails,
      ImageUrl: '' //'' // reset file input
    });
    this.modalService.open(this.editEventModal, { centered: true, size: 'lg' });
  }

  // File change handler
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Save/Update event
  // updateEvent() {
  //   this.isForm1Submitted = true;

  //   if (this.CIFEventRegistration.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;

  //   const formValue = this.CIFEventRegistration.value;
  //   const formData = new FormData();

  //   formData.append('EventId', this.editEvent.eventId);
  //   formData.append('EventName', formValue.EventName);
  //   formData.append('EventDate', formValue.EventDate);
  //   formData.append('EventDetails', formValue.EventDetails || '');
  //   formData.append('CreatedBy', this.user_Email);
  //   if (this.selectedFile) {
  //     formData.append("ImageUrl", this.ConsentLetterFileName);
  //     formData.append("ImageUrlData", this.ConsentLetterData);
  //   } else if (this.editEvent.imageUrl) {
  //     formData.append('ExistingImageUrl', this.editEvent.imageUrl);
  //   }



  //   this.CIFwebService.CIFUpdateEventsDetails(formData).subscribe({
  //     next: (res: any) => {
  //       this.isLoading = false;
  //       swal.fire('Updated Successfully!', '', 'success').then(() => {
  //         this.modalService.dismissAll();
  //         this.GetAllEventDetails(); // refresh list
  //       });
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       swal.fire('Update Failed', 'Please try again.', 'error');
  //       console.error(err);
  //     }
  //   });
  // }

  updateEvent() {
    this.isForm1Submitted = true;
  
    if (this.CIFEventRegistration.invalid || !this.isImageValid) {
      return;
    }
  
    this.isLoading = true;
  
    const formValue = this.CIFEventRegistration.value;
    const formData = new FormData();
  
    formData.append('EventId', this.editEvent.eventId);
    formData.append('EventName', formValue.EventName);
    formData.append('EventDate', formValue.EventDate);
    formData.append('EventDetails', formValue.EventDetails || '');
    formData.append('CreatedBy', this.user_Email);
  
    if (this.selectedFile) {
      formData.append("ImageUrl", this.ConsentLetterFileName);
      formData.append("ImageUrlData", this.ConsentLetterData);
    } else if (this.editEvent.imageUrl) {
      formData.append('ExistingImageUrl', this.editEvent.imageUrl);
    }
  
    this.CIFwebService.CIFUpdateEventsDetails(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        swal.fire('Updated Successfully!', '', 'success').then(() => {
          this.modalService.dismissAll();
          this.GetAllEventDetails();
        });
      },
      error: (err) => {
        this.isLoading = false;
        swal.fire('Update Failed', 'Please try again.', 'error');
        console.error(err);
      }
    });
  }
  

  CIFEventRegistration!: FormGroup; isForm1Submitted: boolean = false; isSubmitted = false;
  isLoading: boolean = false;

  get form1() {
    return this.CIFEventRegistration.controls;
  }

  LoadNewForm() {
    this.CIFEventRegistration = this.fb.group({
      EventName: ['', Validators.required],
      EventDate: ['', Validators.required],
      EventDetails: ['', Validators.required],
      ImageUrl: ['']
    });
  }
  get isImageValid(): boolean {
    // Valid if either a new file is selected or existing image URL is present
    return !!this.selectedFile || !!this.editEvent?.imageUrl;
  }
  
  // get isImageValid(): boolean {
  //   // If editing and existing image present, valid
  //   if (this.editEvent?.imageUrl) {
  //     return true;
  //   }
  //   // Otherwise, require a selected file
  //   return this.selectedFile != null;
  // }

  ConsentLetterData: any = ''; ConsentLetterStatus: boolean = false;
  ConsentLetterFileName: any = '';
  onFileSelectedConsentLetter(event: any): void {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
  
    if (file && file.size > 3148576) {
      Swal.fire({
        title: 'File size exceeds 3MB. Please upload a smaller file.',
        text: 'Invalid File size',
        icon: 'warning'
      });
      target.value = '';
      this.selectedFile = null;
      this.CIFEventRegistration.patchValue({ ImageUrl: '' });
      return;
    }
  
    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (file && !fileNameRegex.test(file.name)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const modifiedFile = new File([file], validFileName, { type: file.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(modifiedFile);
      target.files = dataTransfer.files;
  
      this.selectedFile = modifiedFile;
      this.ConsentLetterFileName = validFileName;
  
      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.ConsentLetterData = ssssArray[1];
      };
    } else {
      this.selectedFile = file;
      this.ConsentLetterFileName = file?.name || '';
      if (file) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const ssss = reader.result as string;
          const ssssArray = ssss.split(',');
          this.ConsentLetterData = ssssArray[1];
        };
      }
    }
  
    // Patch form control to trigger validation update
    this.CIFEventRegistration.patchValue({ ImageUrl: this.ConsentLetterFileName });
    this.CIFEventRegistration.get('ImageUrl')?.markAsTouched();
  }
  

  Onsubmit(): void {
    this.isForm1Submitted = true;

    if (this.CIFEventRegistration.invalid) {
      return;
    }

    if (!this.ConsentLetterData) {
      Swal.fire({
        title: 'Error',
        text: 'Kindly upload a file.',
        icon: 'error'
      });
      return;
    }

    this.isLoading = true;

    const formValue = this.CIFEventRegistration.value;
    const formData = new FormData();

    formData.append('EventName', formValue.EventName);
    formData.append('EventDate', formValue.EventDate);
    formData.append('EventDetails', formValue.EventDetails);


    if (this.selectedFile) {
      formData.append("ImageUrl", this.ConsentLetterFileName);
      formData.append("ImageUrlData", this.ConsentLetterData);
    } else if (this.editEvent.imageUrl) {
      // Optionally send existing image info if needed by backend
      formData.append('ExistingImageUrl', this.editEvent.imageUrl);
    }


    formData.append('CreatedBy', this.UserId);


    formData.forEach((value, key) => {
      console.log(key + ':', value);
    });
    // Call your API service to upload the form data
    this.CIFwebService.CIFNewEventsDetails(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Event Stored Successfully!',
          icon: 'success'
        }).then(() => {
          this.CIFEventRegistration.reset();
          this.FileData = null;
          this.fileName = '';
          this.isForm1Submitted = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Upload Failed',
          text: 'There was an error uploading the file.',
          icon: 'error'
        });
      }
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}