import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
// import flatpickr from 'flatpickr';
import { ClickToCallService } from 'src/app/_services/click-to-call.service';



declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-click-to-call',
  templateUrl: './click-to-call.component.html',
  styleUrls: ['./click-to-call.component.css'],
  // standalone: true,
})
export class ClickToCallComponent implements AfterViewInit {
  @ViewChild('clickToCallModal') clickToCallModal!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private callService: ClickToCallService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeModalListeners();
      this.getAvailableDates();
      this.setupClickHandlers();

      const laterTab = document.getElementById('call-us-later-tab');
      laterTab?.addEventListener('click', () => {
        setTimeout(() => this.initializeTimePicker(), 300);
      });

      const modalEl = document.getElementById('click-to-call');
      modalEl?.addEventListener('shown.bs.modal', () => {
        if (
          document.getElementById('call-us-later')?.classList.contains('show')
        ) {
          this.initializeTimePicker();
        }
      });
    }
  }

  initializeModalListeners() {
    const modal = document.getElementById('click-to-call')!;
    const input = document.getElementById('callphone')!;
    const callNowTab = document.getElementById('call-now-tab');

    modal.addEventListener('shown.bs.modal', () => {
      if (document.getElementById('call-now')?.classList.contains('show')) {
        input.focus();
      }
    });

    callNowTab?.addEventListener('click', () => {
      setTimeout(() => input.focus(), 200);
    });
  }

  initializeTimePicker(): void {
    const now = new Date();
    const minutesToAdd = 5 - (now.getMinutes() % 5);
    if (minutesToAdd < 5) {
      now.setMinutes(now.getMinutes() + minutesToAdd);
    }
    now.setSeconds(0);
    now.setMilliseconds(0);

    const minTime = new Date(now);
    const maxTime = new Date();
    maxTime.setHours(20, 0, 0); // 8 PM

    if (now.getHours() >= 20) {
      minTime.setDate(minTime.getDate() + 1);
      minTime.setHours(8, 0, 0);
    }

    flatpickr('#timeInput', {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      defaultDate: minTime,
      minTime: this.formatTime(minTime),
      maxTime: '20:00:00',
      time_24hr: true,
    });
  }

  formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  getAvailableDates() {
    this.callService.getAvailableDates().subscribe({
      next: (response: any) => {
        const dateSelect = $('#dateSelect');
        dateSelect
          .empty()
          .append('<option value="" disabled selected>Select Date</option>');
        response.ctcDates.forEach((dateObj: any) => {
          dateSelect.append(
            `<option value="${dateObj.sDate}">${dateObj.sDate}</option>`
          );
        });
      },
      error: (error: any) => {
        console.error('Error fetching available dates:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch available dates. Please try again later.',
        });
      },
    });
  }

  //Call now Button
  setupClickHandlers() {
    $('#make-call').on('click', (e: any) => {
      e.preventDefault();
      const phoneNumber = $('#callphone').val()?.toString().trim();

      if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Number',
          text: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.',
        });
        return;
      }

      const requestData = {
        phoneNumber,
        date: new Date().toISOString(),
        ipAddress: '',
        status: '',
      };

      $('#make-call').attr('disabled', 'disabled').val('Calling in Process');

      this.callService.makeCall(requestData).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Call initiated successfully! Status: ' + response.status,
          }).then(() => {
            const modalEl = document.getElementById('click-to-call')!;
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
            $('#make-call').val('Call me now').removeAttr('disabled');
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Request not processed',
            text: 'Failed to make the call. Please try again later.',
          }).then(() => {
            const modalEl = document.getElementById('click-to-call')!;
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
            location.reload();
          })
          $('#make-call').val('Call me now').removeAttr('disabled');
        },
      });

      $('#callphone').val('');
    });

    //Schedule Call Button
    $('#schedule-call').on('click', (e: any) => {
      e.preventDefault();

      const name = $('#name').val()?.toString().trim();
      const phoneNumber = $('#mobileNumber').val()?.toString().trim();
      const programme = $('#programmeInterested').val()?.toString().trim();
      const date = $('#dateSelect').val();
      const time = $('#timeInput').val();

      if (!name) {
        Swal.fire({
          icon: 'warning',
          title: 'Name',
          text: 'Please enter your name.',
        });
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(name)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Name',
          text: 'Please enter a valid name.',
        });
        return;
      }
      if (!phoneNumber) {
        Swal.fire({
          icon: 'warning',
          title: 'Mobile Number',
          text: 'Please enter your mobile number.',
        });
        return;
      }

      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Mobile Number',
          text: 'Please enter a valid 10-digit mobile number.',
        });
        return;
      }

      if (!programme) {
        Swal.fire({
          icon: 'warning',
          title: 'Programme',
          text: 'Please enter the programme you are interested in.',
        });
        return;
      }

      if (!date) {
        Swal.fire({
          icon: 'warning',
          title: 'Date',
          text: 'Please select a date.',
        });
        return;
      }

      if (!time) {
        Swal.fire({
          icon: 'warning',
          title: 'Time',
          text: 'Please select a time.',
        });
        return;
      }

      const requestData = {
                    phonenumber: phoneNumber,
                    date: new Date(date + " " + time).toISOString(),
                    time: time,
                    name: name,
                    programme: programme,
                    status: "success"
      };
      $('#schedule-call').attr('disabled', 'disabled').val('Schedulecall in Process');
      
      this.callService.scheduleCall(requestData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Call scheduled successfully!',
          }).then(() => {
            const modalEl = document.getElementById('click-to-call')!;
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          });

          $(
            '#mobileNumber, #name, #programmeInterested, #dateSelect, #timeInput'
          ).val('');
        },
        error: (xhr: any) => {
          console.error('ScheduleCall API error:', xhr);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text:
              xhr.responseJSON?.message ||
              'Unable to schedule the call. Please try again.',
          }).then(() => {
            const modalEl = document.getElementById('click-to-call')!;
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
            
          });
          $(
            '#mobileNumber, #name, #programmeInterested, #dateSelect, #timeInput'
          ).val('');
          location.reload();
        },
      });
    });

    // Optional date change handler
    $('#dateSelect').on('change', () => {
      const selectedDate = $('#dateSelect').val();
      if (selectedDate) {
        console.log('Selected Date:', selectedDate);
      }
    });

    // Default tab on load
    $(document).ready(() => {
      $('#call-us-later-tab').removeClass('active');
      $('#call-us-later').removeClass('show active');

      $('#call-now-tab').addClass('active');
      $('#call-now').addClass('show active');
    });
    
  }
}
function flatpickr(arg0: string, arg1: { enableTime: boolean; noCalendar: boolean; dateFormat: string; defaultDate: Date; minTime: string; maxTime: string; time_24hr: boolean; }) {
  throw new Error('Function not implemented.');
}

