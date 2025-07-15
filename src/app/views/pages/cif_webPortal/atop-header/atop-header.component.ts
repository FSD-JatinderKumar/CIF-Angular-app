import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
@Component({
  selector: 'app-atop-header',
  templateUrl: './atop-header.component.html',
  styleUrls: ['./atop-header.component.scss'],
  standalone: false
})
export class ATopHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

}
