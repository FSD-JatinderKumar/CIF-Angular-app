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
    const GetCookieData = this.cookieService.get('authData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.EmailId;
    // this.UserId = '121309';
    this.LoadNewForm();
    this.GetAllEventDetails();
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
  events: any=[];
 // added on 21-aug-25
 chunkedEvents: any[][] = [];

 chunkArray(arr: any[], size: number): any[][] {
   return arr.reduce((acc, _, i) => 
     (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
 }
 Staticevents = [
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/summer-training-programme-2025.webp',
     eventName: 'ANRF Sponsored Summer Training Programme',
     eventDate: '(2 June - 11 July 2025)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-10.jpg',
     eventName: 'Discovering the Crystalline and Nano world using X-ray Diffraction and Particle Size and Zeta Potential Analyzer: A National Workshop',
     eventDate: '(24 – 26 April 2025)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-9.jpg',
     eventName: 'National Workshop on Advance Research with Field Emission Scanning Electron Microscopy: Exploring the Nano-Structural Imaging',
     eventDate: '(27 - 29 March 2025)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-7.jpg',
     eventName: 'National Workshop on Advanced Chromatographic Techniques Theory & Applications',
     eventDate: '(19 - 21 September, 2024)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-8.jpg',
     eventName: 'SHORT-TERM COURSE on Advanced Materials analysis & Characterization Techniques: Hands-on-Training and Data Interpretation',
     eventDate: '(09 – 13 December, 2024)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-1.jpg',
     eventName: 'National workshop on X-Ray Diffraction and Particle Size Analyzer',
     eventDate: '(26 - 27 April 2024)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-2.jpg',
     eventName: 'Summer Training Programme',
     eventDate: '(3 June - 13 July 2024)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/event-3.jpg',
     eventName: 'Workshop on Field Emission Scanning Electron Microscope',
     eventDate: '(29 - 30 March 2024)'
   },
   {
     imageUrl: 'https://www.lpu.in/lpu-assets/images/cif/summer-training-programme-2025.webp',
     eventName: 'ANRF Sponsored Summer Training Programme',
     eventDate: '(2 June - 11 July 2025)'
   },    
 ];

 get eventGroups() {
   const groups = [];
   for (let i = 0; i < this.events.length; i += 3) {
     groups.push(this.events.slice(i, i + 3));
   }
   return groups;
 }


  GetAllEventDetails(): void {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllEventDetails().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.events = response.item1;
        } else {
          this.events = this.Staticevents;
        }
        // Update chunkedEvents after events are set
        this.chunkedEvents = this.chunkArray(this.events, 3);
  
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(2500 - elapsed, 0); // wait at least 2.5s
  
        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        this.loadingIndicator = false;
        console.error(err);
        // Fallback to static events and chunk them
        this.events = this.Staticevents;
        this.chunkedEvents = this.chunkArray(this.events, 3);
      }
    });
  }
  
}
