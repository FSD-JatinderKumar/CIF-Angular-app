import { Component, ElementRef, EventEmitter,HostListener, OnInit,Output,ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DOCUMENT } from '@angular/common';

import swal from 'sweetalert2';

@Component({
  selector: 'app-HomePageTopBar',
  templateUrl: './HomePageTopBar.component.html',
  styleUrls: ['./HomePageTopBar.component.scss'],

})

export class HomePageTopBarComponent implements OnInit {
  @Output() facilitiesClicked = new EventEmitter<void>();
  onFacilitiesClick() {
    this.facilitiesClicked.emit();
  }

  constructor(
    private CIFwebService: LpuCIFWebService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkScroll();
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


  goto(val: any): void {
    this.router.navigateByUrl(val);
  }  



 
  menuIconChanged = false;
  isFixedNav = false;

  

  toggleMenuIcon(): void {
    this.menuIconChanged = !this.menuIconChanged;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    const y = window.scrollY || window.pageYOffset;
    const isIndexPage = document.body.classList.contains('index-page');
    const navWrapElement = document.getElementById('nest-nav-scroll');
    const navWrap = isIndexPage && navWrapElement ? navWrapElement.offsetTop : 100;

    if (window.innerWidth > 1030) {
      this.isFixedNav = y > navWrap;
    } else {
      this.isFixedNav = false;
    }
  }

}
