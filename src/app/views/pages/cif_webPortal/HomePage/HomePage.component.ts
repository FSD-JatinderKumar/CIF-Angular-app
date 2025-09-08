
import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DOCUMENT } from '@angular/common';

import swal from 'sweetalert2';
@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.scss'],
})
export class HomePageComponent implements OnInit {
  @ViewChild('facilitiesSection') facilitiesSection!: ElementRef;
  // Method to scroll to the Facilities section
  gotoFacilities() {
    this.facilitiesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ResultData: any[] = []; currentPage = 1; itemsPerPage = 10; InstrumentsDataData: any[] = [];
  tmpsInstrumentsDataData: any[] = []; tmpsResultData: any[] = [];
  InstrumentId: any; instrumentName: any = ''; UserRole: any; UserId: any; uploadEnabled: boolean; Remarks: any; dataSource: any;
  Description: any; ImageUrl: any;
  ColumnMode = ColumnMode; columns: any; loadingIndicator = false; headHtmlData: any[] = []; p: any = 1; perPage: any = 5;
  @ViewChild('table') table: ElementRef;
  loadingStates: boolean[] = []; ServerUrl: any; isLoading: boolean = true; loadedCount: number = 0;
  events: any = [];
  constructor(
    private CIFwebService: LpuCIFWebService,
    private fb: FormBuilder, private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ServerUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';
    this.getAllInstruments();
    this.GetAllEventDetails()

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
          Phone : <a href="tel:+911824444021">+91 1824-444021</a><br>
          Email : cif@lpu.co.in<br>
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
    event.target.src = '/image.jpg';
    this.loadingStates[index] = false;
  }

  getAllInstruments(): void {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAllInstrumentsData().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentsDataData = response.item1;
          this.tmpsInstrumentsDataData = response.item1.slice(0, 8);
          this.loadingStates = Array(this.tmpsInstrumentsDataData.length).fill(true); // Initialize loading states
        } else {
          this.InstrumentsDataData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(2500 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        this.loadingIndicator = false;
        console.error(err);
      }
    });
  }


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




  testClick(a: any): void {
    const fileName = `${a}.pdf`;
    const fileUrl = `assets/CifDocumentsTemplates/${fileName}`;

    // Check if the file exists
    fetch(fileUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // console.error('File not found:', fileUrl);
          // alert('File not found');
        }
      })
      .catch(error => {
        // console.error('Error fetching the file:', error);
        alert('Error downloading file');
      });
  }
  isDisabled: any = true;
  showSearchForm: boolean = false; show: boolean = true; isSearchOpen: boolean = false;
  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    this.show = !this.show;
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
