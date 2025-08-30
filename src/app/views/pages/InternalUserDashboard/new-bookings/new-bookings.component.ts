import { FormControl, FormGroup } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { LoginSessionService } from 'src/app/_services/login-session.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-bookings',
  templateUrl: './new-bookings.component.html',
  styleUrls: ['./new-bookings.component.scss']
})
export class NewBookingsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  InstrumentData: any[] = []; InstrumentDataInactive: any[] = []; AnalysisData: any[] = []; UserRole: any;
  PriceValue: any; Duration: any; NumberOfSamples: any; totalAmount: any; Remarks: any; Instrument: any; user_Email: any;
  AnalysisId: any; selectedId: number; InstrumentId: any; selectedDuration: string; PriceData: any; disableBooking: boolean;
  obj: any; newDynamic: any = {}; Datagrid: any[] = []; sessionData: any[] = [];
  InstrumentsDuration: any[] = [];
  rows: any[] = [{ InstrumentName: '', AnalysisIdx: '', Durationx: '', Chargesx: '', NoOfSamplex: '', TotalAmountx: '', Remarksx: '' }];
  UserId: any; fileData: File; fileStatus: boolean; FileData: string; fileName: string; uploadEnabled: boolean; isHourly: any;
  isActive: any; concatenatedInstrumentNames: string; InActiveInstrumentIds: string; Message: string = '';

  addRow() {
    this.rows.push({ InstrumentName: '', AnalysisIdx: '', Durationx: '', Chargesx: '', NoOfSamplex: '', TotalAmountx: '', Remarksx: '' });
  }


  deleteRow(index: number) {
    if (index > 0)
      this.rows.splice(index, 1);
    else {
      swal.fire({
        title: 'Not Allowed',
        text: 'At Least One Record is required!',
        icon: 'warning',
      })
    }
  }

  currentStep = 1;


  goToNextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  formdata = new FormGroup({
    InstrumentName: new FormControl('Select', Validators.required),
    AnalysisId: new FormControl('Select', Validators.required),
    Duration: new FormControl('Select', Validators.required),
    Charges: new FormControl('', Validators.required),
    NoOfSample: new FormControl('', Validators.required),
    TotalAmount: new FormControl('', Validators.required),
    Remarks: new FormControl('', Validators.required),
    ExcelData: new FormControl('', Validators.required),

  })
  constructor(
    private CIFwebService: LpuCIFWebService,
    public formBuilder: UntypedFormBuilder,
    private router: Router, private cookieService: CookieService
  ) { }
  loadingIndicator: any;
  ngOnInit(): void {

    const GetCookieData = this.cookieService.get('InternalUserAuthData');
    const retrievedCookies = JSON.parse(GetCookieData);
    this.UserRole = retrievedCookies.UserRole;
    this.UserId = retrievedCookies.UserRole;
    this.user_Email = retrievedCookies.EmailId;
    this.candidateName = retrievedCookies.CandidateName;
    this.MobileNo = retrievedCookies.MobileNo;
    // console.log(retrievedCookies);
    this.getInstrumentData();
  }



  nextStep() {
    if (this.currentStep < 2 && this.formdata.valid) {
      this.currentStep++;
    }
  }


  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  getDurationData(AnalysisId: any) {
    this.loadingIndicator=true;
    const startTime = new Date().getTime();


    this.CIFwebService.GetAnalysisData(AnalysisId, this.UserId).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentsDuration = response.item1;
          // console.log(JSON.stringify(this.InstrumentsDuration));
        }
        else {
          this.InstrumentsDuration = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });
  }


  getInstrumentData() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetInstrumentsDetails().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.InstrumentData = response.item1;
          // this.InstrumentDataInactive = response.item1.filter((instrument: any) => instrument.isActive === 'false');
          // console.log("All Instruments " +JSON.stringify(this.InstrumentData))
          this.InstrumentDataInactive = response.item1.filter((instrument: any) => instrument.isActive === false);
          // Concatenate all instrument names separated by commas
          this.concatenatedInstrumentNames = this.InstrumentDataInactive
            .map((instrument: any) => instrument.instrumentName)
            .join(' | ');
          this.InActiveInstrumentIds = this.InstrumentDataInactive.map((instrument: any) => instrument.instrumentId).join(' | ');
          // console.log("Inactive Instruments " +JSON.stringify(this.InstrumentDataInactive))
        }
        else {
          this.InstrumentData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });
  }
  InstrumentName: any;
  getAllAnalysis(event: Event) {
    this.Duration = this.AnalysisId = this.PriceValue = '';
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Split the selected value to get the instrument ID and name
    const [selectedInstrumentIdStr, ...instrumentNameParts] = selectedValue.split(' ');
    const selectedInstrumentId = parseInt(selectedInstrumentIdStr, 10);
    const selectedInstrumentName = instrumentNameParts.join(' '); // Join the remaining parts for the name
    this.InstrumentName = selectedInstrumentName;
    if (selectedInstrumentId) {
      // Find the selected instrument using its ID
      const selectedInstrument = this.InstrumentData?.find(instrument => instrument.instrumentId === selectedInstrumentId);
      const inactiveInstrument = this.InstrumentDataInactive?.find(instrument => instrument.instrumentId === selectedInstrumentId);

      // Check if the selected instrument is inactive
      if (inactiveInstrument && this.InActiveInstrumentIds?.includes(selectedInstrumentId.toString())) {
        swal.fire({
          title: 'This instrument is under Maintenance. You cannot proceed with this selection.',
          icon: 'error',
        }).then(() => {
          window.location.reload();
        });
        return; // Exit the function to prevent further action
      }

      // Set the selected instrument values and proceed
      this.selectedId = selectedInstrumentId;
      this.InstrumentId = this.selectedId;
      this.testClick(this.InstrumentId);
      this.Message = "A Format File is being Downloaded. You need to fill and upload this Excel sheet to send your requirements!";
      swal.fire({
        title: this.Message,
        icon: 'warning',
      });

      if (selectedInstrument) {
        this.isActive = selectedInstrument.isActive;
        this.Duration = "Other Cases";

        // Log the selected instrument name for reference
        // console.log('Selected Instrument Name:', selectedInstrumentName);

        this.GetInstrumentIDWiseAnalysisDetails(this.selectedId);
      }
    }
  }

  setAnalysisId(event: Event) {

    const selectElement = event.target as HTMLSelectElement; const selectedValue = selectElement.value;
    const AnalysisIndex = Array.from(selectElement.options).findIndex(option => option.value === selectedValue);
    this.Duration = this.PriceValue = '';
    if (AnalysisIndex !== -1) {
      selectElement.selectedIndex = AnalysisIndex;
      this.selectedId = parseInt(selectedValue, 10);
      this.AnalysisId = this.selectedId;
      // console.log("AnalysisId for instrument" + this.AnalysisId + "==" + JSON.stringify(this.AnalysisId))
      this.getDurationData(this.AnalysisId)
    }
  }
  GetInstrumentIDWiseAnalysisDetails(selectedId: number) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.CIFwebService.GetAnalysisDetails(selectedId).subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.AnalysisData = response.item1;
          // console.log("AnalysisData for instrument" + selectedId + "==" + JSON.stringify(this.AnalysisData))
        }
        else {
          this.AnalysisData = [];
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: err => {
        console.log(err)
      }
    });

  }
  getPrice(event: Event) {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    this.NumberOfSamples = '';
    this.totalAmount = '';
    const selectElement = event.target as HTMLSelectElement;
    const selectedAnalysisId = selectElement.value; // Get the selected analysisId
    const selectedTypeName = selectElement.options[selectElement.selectedIndex].text; // Get the selected typeName (Duration)


    if (selectedAnalysisId !== 'Select') {
      this.selectedDuration = selectedTypeName; // Set the selected duration (typeName)

      // Fetch price using both analysisId and selected typeName
      this.CIFwebService.GetDuationAndPrice(selectedAnalysisId, this.UserRole, this.selectedDuration).subscribe({
        next: response => {
          if (response.item1 && response.item1.length > 0) {
            // Find the correct entry that matches the selected typeName
            const matchingPriceData = response.item1.find((item: any) => item.typeName === this.selectedDuration);

            if (matchingPriceData) {
              this.PriceValue = matchingPriceData.price;

              if (this.PriceValue === 'N/A' || this.PriceValue === 'NA') {
                this.disableBooking = true;
                swal.fire({
                  title: 'This Test is not Allowed',
                  text: 'Kindly proceed with some other test!',
                  icon: 'warning',
                });

                setTimeout(() => {
                  this.formdata.reset();
                }, 500);
              }
            } else {
              // console.log('No matching data for the selected typeName');
            }
          } else {
            this.AnalysisData = [];
            // console.log('No analysis data found');
          }
          const elapsed = new Date().getTime() - startTime;
          const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s
  
          setTimeout(() => {
            this.loadingIndicator = false;
          }, remainingDelay);
        },
        error: err => {
          console.log('Error:', err);
        }
      });
    } else {
      // console.log('Invalid selection or "Select" option chosen');
    }
  }


  calculateAmount() {
    var CostofTest = this.PriceValue != 'N/A' ? parseInt(this.PriceValue) : 0
    var NoOfSamples = parseInt(this.NumberOfSamples);

    this.totalAmount = NoOfSamples * CostofTest;

  }


  Onsubmit() {
    this.loadingIndicator = true;
    const startTime = new Date().getTime();
    const AnalysisCharge = this.PriceValue === 'N/A' ? 0 : parseInt(this.PriceValue);
    const TotalPrice = this.totalAmount === 'NA' ? 0 : parseInt(this.totalAmount);
    const formData = new FormData();
    formData.append("InstrumentId", this.InstrumentId);
    formData.append("UserEmailId", this.user_Email);
    formData.append("AnalysisId", this.AnalysisId);
    formData.append("AnalysisCharges", AnalysisCharge.toString());
    formData.append("NoOfSamples", this.NumberOfSamples);
    formData.append("TotalCharges", TotalPrice.toString());
    formData.append("Remarks", this.Remarks);
    // formData.append("RequestDate", this.LoginId);
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    var result;
    this.CIFwebService.addBookingSlot(formData).subscribe({
      next: data => {
        result = data.item1[0]['msg']
        if (result == 'OK') {
          swal.fire({
            title: 'Uploaded the Document',
            text: data.item1[0]['msg'],
            icon: 'success'
          }
          );
        }
        else {
          swal.fire({
            title: 'Somthing went wrong',
            text: result,
            icon: 'error'
          });
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
        // window.location.reload();
      },
    });
  }



  testClick(a: any): void {
    const fileName = `${a}.xlsx`;
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
      .catch(() => {
        // console.error('Error fetching the file:', error);
        alert('Error downloading file');
      });
  }

  goToDetails() {
    if (this.Datagrid.length > 0) {
      this.goToNextStep();
    } else {

      alert('No tests added to view details.');
    }
  }
  Addtogrid() {

    // if (this.formdata.valid) {
    //   this.Datagrid.push(this.formdata.value);
    //   this.formdata.reset();
    // }

    if (this.formdata.valid) {
      this.obj = { instrumentName: this.InstrumentName, instrument: this.InstrumentId, analysisId: this.AnalysisId, Duration: this.Duration, PriceValue: this.PriceValue, NumberOfSamples: this.NumberOfSamples, totalAmount: this.totalAmount, Remarks: this.Remarks }
      this.newDynamic = { instrumentName: this.InstrumentName, instrument: this.InstrumentId, analysisId: this.AnalysisId, Duration: this.Duration, PriceValue: this.PriceValue, NumberOfSamples: this.NumberOfSamples, totalAmount: this.totalAmount, Remarks: this.Remarks, UserEmailId: this.user_Email };
      this.Datagrid.push(this.newDynamic);
      this.clear();
    }
  }
  clear() {

    this.formdata.patchValue({
      InstrumentName: 'Select',
      AnalysisId: 'Select',
      Duration: 'Select',
      Charges: '',
      NoOfSample: '',
      TotalAmount: '',
      Remarks: '',

    });


    this.Remarks = '';
    this.PriceValue = '';
    this.NumberOfSamples = '';
    this.totalAmount = '';
    this.fileInput.nativeElement.value = '';


  }
  deleteEntry(index: number) {
    this.Datagrid.splice(index, 1);
  }
  saveAllRecords() {
    this.loadingIndicator=true;
    const startTime = new Date().getTime();

    const apiCalls = this.Datagrid.map(item => {
      const formData = new FormData();
      formData.append('InstrumentId', item.instrument.toString()); // InstrumentId
      formData.append('analysisId', item.analysisId.toString()); // BookingId
      formData.append('Duration', item.Duration);
      formData.append('AnalysisCharges', item.PriceValue.toString()); // Amount
      formData.append('NoOfSamples', item.NumberOfSamples.toString());
      formData.append('TotalCharges', item.totalAmount.toString());
      formData.append('Remarks', item.Remarks);
      formData.append('UserEmailId', this.user_Email);
      formData.append('FilePath', this.fileName);
      formData.append('File', this.FileData);

      return this.CIFwebService.addBookingSlot(formData);
    });

    forkJoin(apiCalls).subscribe({
      next: results => {
        let allSuccess = true;
        results.forEach(data => {
          const result = data.item1[0]['msg'];
          if (result !== 'OK') {
            allSuccess = false;
            swal.fire({
              title: 'Something went wrong',
              text: result,
              icon: 'error'
            });
          }
        });
        if (allSuccess) {
          swal.fire({
            title: 'Uploaded all Documents',
            text: 'All records have been uploaded successfully.',
            icon: 'success'
          }).then(() => {
            this.router.navigateByUrl("ViewBookings");
          });
        }
        const elapsed = new Date().getTime() - startTime;
        const remainingDelay = Math.max(1000 - elapsed, 0); // wait at least 5s

        setTimeout(() => {
          this.loadingIndicator = false;
        }, remainingDelay);
      },
      error: () => {
        swal.fire({
          title: 'Error',
          text: 'An error occurred while saving the records.',
          icon: 'error'
        });
      }
    });
  }

  getTotalPayment(): number {
    return this.Datagrid.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  processPayment() {
  }

  onFileSelected(event: any): void {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file && file.size > 3148576) {
      swal.fire({
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

      this.fileData = modifiedFile;
      this.fileStatus = true;

      reader.readAsDataURL(modifiedFile);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileData = ssssArray[1];
        this.fileName = validFileName;
      };
      this.uploadEnabled = true;
      return;
    }

    this.fileData = file;
    this.fileStatus = true;
    // alert(10);
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const ssss = reader.result as string;
        const ssssArray = ssss.split(',');
        this.FileData = ssssArray[1];
        this.fileName = file.name;
        // alert(10);

        this.uploadEnabled = true;
      };
    }
  }
  paymentData: any; MobileNo: any; departmentName: any; candidateName: any; supervisorName: any; serverUrl: any;
  TypeId: any = 'CIF';

  VerifyData(BookingCase: any) {
    const formData = new FormData();
    formData.append('BookingId', BookingCase.analysisId);
    formData.append('InstrumentId', BookingCase.instrument);
    formData.append('CandidateName', this.candidateName);
    formData.append('Amount', BookingCase.PriceValue);
    formData.append('Type', this.TypeId);
    formData.append('UserEmailId', this.user_Email);
    formData.append('MobileNo', this.MobileNo);
    formData.append('FacultyCode', this.user_Email);

    forkJoin({
      payment: this.CIFwebService.MakePaymentforTest(formData),
    }).subscribe({
      next: (results: any) => {
        this.paymentData = results;
        if (results) {
          const paymentUrlData = results.payment.item1[0].url;
          if (paymentUrlData && paymentUrlData.length > 0) {
            window.location.href = paymentUrlData;
          } else {
            Swal.fire({
              title: 'Error Occurred, Try Again Later',
              text: 'Payment URL not found!',
              icon: 'error',
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No data received from the API!',
            icon: 'error',
          });
        }
      },
      error: (error: any) => {
        console.error('Error during API call: ', error);
        Swal.fire({
          title: 'Error',
          text: 'Payment Gateway Failed!',
          icon: 'error',
        });
      },
    });
  }


  openQRCodeScreen(url: string): Promise<any> {
    window.open(url, '_blank');
    return Swal.fire({
      title: 'Scan the QR Code to Proceed with Payment',
      html: `<qrcode [qrdata]="this.qrCodeUrl" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>`,
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Cancel',
    });
  }

}
