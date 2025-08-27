import { Component, ElementRef, EventEmitter, OnInit,Output,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-LPUTermsConditions',
  templateUrl: './LPUTermsConditions.component.html',
  styleUrls: ['./LPUTermsConditions.component.scss']
})
export class LPUTermsConditionsComponent implements OnInit {
  @ViewChild('facilitiesSection') facilitiesSection!: ElementRef;
  // Method to scroll to the Facilities section
  gotoFacilities() {
    this.facilitiesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  constructor(
    public formBuilder: UntypedFormBuilder,
    private router: Router, private route: ActivatedRoute, private cookieService: CookieService
  ) { }

  ngOnInit(): void {
     
  }

}
 

