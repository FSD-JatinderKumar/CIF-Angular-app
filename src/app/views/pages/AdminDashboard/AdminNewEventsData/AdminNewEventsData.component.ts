import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { LoginSessionService } from 'src/app/_services/login-session.service';

@Component({
  selector: 'app-AdminNewEventsData',
  templateUrl: './AdminNewEventsData.component.html',
  styleUrls: ['./AdminNewEventsData.component.scss']
})
export class AdminNewEventsDataComponent implements OnInit {

  Remarks: any; serverUrl: string; UserRole: any; UserId: any; loadingIndicator: boolean = false; FileData: any; fileName: any;
  fileStatus: boolean = false; fileData: any; uploadEnabled: boolean = false;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private AuthSession: LoginSessionService,

    private cookieService: CookieService) { }
  user_Email: any; sessionData: any[] = [];
  getSessionDetails() {
    this.sessionData = this.AuthSession.getSession();
    for (const session of this.sessionData) {
      this.user_Email = session[0]['userEmail']
    }
  }
  ngOnInit(): void {
    this.serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';//'http://172.19.2.52/umsweb/webftp/CIFDocuments/';
    // const GetCookieData = this.cookieService.get('authData');
    // const retrievedCookies = JSON.parse(GetCookieData);
    // this.UserRole = retrievedCookies.UserRole;
    // this.UserId = retrievedCookies.EmailId;
    this.UserId = '121309';
    this.LoadNewForm();

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
      ImageUrl: ['',]  // Required, no pattern validator for file input
    });
  }


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
      return;
    }
    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (file && !fileNameRegex.test(file.name)) {
      const validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

      const modifiedFile = new File([file], validFileName, { type: file.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(modifiedFile);
      target.files = dataTransfer.files;

      this.ConsentLetterData = modifiedFile;
      this.ConsentLetterStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.ConsentLetterData = ssssArray[1];
        this.ConsentLetterFileName = validFileName;
      };

      return;
    }

    this.ConsentLetterData = file;
    this.ConsentLetterStatus = true;
    // alert(10);  
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.ConsentLetterData = ssssArray[1];
        this.ConsentLetterFileName = file.name;
      };
    }
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
    formData.append("ImageUrl", this.ConsentLetterFileName);
    formData.append("ImageUrlData", this.ConsentLetterData);
    formData.append('CreatedBy', this.UserId);
    // formData.forEach((value, key) => {
    // console.log(key + ':', value);});
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
}
