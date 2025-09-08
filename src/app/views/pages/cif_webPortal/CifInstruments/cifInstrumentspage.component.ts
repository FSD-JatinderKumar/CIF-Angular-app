import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LpuCIFWebService } from 'src/app/_services/lpu-cifweb.service';

@Component({
  selector: 'app-CifInstrumentspage',
  templateUrl: './cifInstrumentspage.component.html',
  styleUrls: ['./cifInstrumentpage.component.scss']
})
export class CifInstrumentsPage implements OnInit {
  instrumentStatus: string = '';
  isInstrumentActive: boolean = false;
  specifications: any[] = [];
  cifInstrumentsDataData: any[] = [];
  tmpscifInstrumentsDataData: any[] = [];
  InstrumentId: any;
  instrumentName: string = '';
  ImageUrl: string = '';
  Description: string = '';
  categoryId: number = 0;
  cifInstrumentsCharges: any[] = [];

  // ✅ FAQ Accordion Data

//   faqs: FAQGroup[] = [
//     {
//       title: 'Field Emission Scanning Electron Microscope (FE SEM)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: How many samples can be submitted in a single request form?', answer: 'Ans: Maximum of 5 samples' },
//         { question: 'Q2: Does the Gold sputtering process affect the sample?', answer: 'Ans: No, the process only creates a very thin coating on the sample surface to enhance the conductivity for good imaging.' },
//         { question: 'Q3: What amount of sample is required for FESEM?', answer: 'Ans: Powder: Minimum of 2.5 to 5mg. Film: Maximum allowed size 1cm x 1cm.' },
//         { question: 'Q4: How will we come to know about the slot allocation?', answer: 'Ans: The concerned operator/office assistant will intimate you at least a week before your slot by calling you.' }
//       ]
//     },
//     {
//       title: 'UV-Vis Spectrophotometer',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What wavelength range is used for your UV-Vis instrument?', answer: 'Ans: 200 nm to 800 nm' },
//         { question: 'Q2: Can I reuse the sample after the analysis for other experiments?', answer: 'Ans: Yes, if your sample is not UV sensitive you can reuse it. UV-Vis spectrometer analysis is a non-destructive method.' },
//         { question: 'Q3: Is it necessary to provide final dilution of sample for UV analysis?', answer: 'Ans: Yes, user must provide the sample in final diluted form.' }
//       ]
//     },
//     {
//       title: 'Thermogravimetric Analysis (TGA)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: How much sample is required for TGA analysis?', answer: 'Ans: 5-8mg' },
//         { question: 'Q2: What is the normally used heating rate in TGA analysis?', answer: 'Ans: 10°C/Min' },
//         { question: 'Q3: Can we do TGA analysis of Liquid samples?', answer: 'Ans: No! TGA analysis can only be performed on Powder or Film samples.' },
//         { question: 'Q4: What is the maximum possible heating range of the TGA instrument available in CIF?', answer: 'Ans: The maximum temperature range is 1000°C.' }
//       ]
//     },
//     {
//       title: 'Differential Scanning Calorimeter (DSC)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: How much sample is required for DSC analysis?', answer: 'Ans: 8 to 10mg' },
//         { question: 'Q2: Which gases are used for the analysis process?', answer: 'Ans: Nitrogen' },
//         { question: 'Q3: Which type of sample pan is used in DSC?', answer: 'Ans: Aluminium type' }
//       ]
//     },
//     {
//       title: 'Powder X-ray Diffractometer (XRD)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: Can I use the sample after XRD analysis?', answer: 'Ans: Yes! XRD is non-destructive. The sample can be used again. We take utmost care not to contaminate the sample.' },
//         { question: 'Q2: I have an unknown mineral sample. Can I use XRD to identify it?', answer: 'Ans: Yes! XRD can be used to identify crystal patterns or phases. For better results, we recommend running XRF before XRD to know the composition.' },
//         { question: 'Q3: Which Databases are available in CSIF?', answer: 'Ans: ICSD (Inorganic Crystal Structure Database), PDF2 ICDD (JCPDS), Software: Highscore Plus' },
//         { question: 'Q4: What amount of sample is required for XRD?', answer: 'Ans: Powder: Minimum of 400–500 mg' }
//       ]
//     },
//     {
//       title: 'FTIR Spectrometer',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What type of samples can be analyzed?', answer: 'Ans: Powder and Liquid samples' },
//         { question: 'Q2: Can we analyze liquid samples?', answer: 'Ans: Yes' },
//         { question: 'Q3: In which ranges can we obtain IR spectra?', answer: 'Ans: 4000–400 cm-1' },
//         { question: 'Q4: How much sample is required?', answer: 'Ans: 5–10 mg' }
//       ]
//     },
//     {
//       title: 'Gas Chromatography with Mass Spectrometry (GC-MS/MS)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: Can gas samples be analyzed using GCMS/MS?', answer: 'Ans: No, only solid and liquid samples.' },
//         { question: 'Q2: Do I have to submit reference standards for quantitative analysis?', answer: 'Ans: Yes, reference standards must be provided.' },
//         { question: 'Q3: Are results provided with library comparison?', answer: 'Ans: Yes, NIST library comparison data is provided.' },
//         { question: 'Q4: Can direct injection mass spectra be obtained?', answer: 'Ans: Yes, using MS/MS in CIF.' }
//       ]
//     },
//     {
//       title: 'High Performance Liquid Chromatography (HPLC)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What is the minimum quantity required?', answer: 'Ans: Powder samples – 5–10 mg; Liquid samples – Minimum 2 ml final dilution' },
//         { question: 'Q2: Do I have to submit reference standards?', answer: 'Ans: Yes, reference standards must be provided.' },
//         { question: 'Q3: What kind of detectors are available?', answer: 'Ans: PDA (Photo Diode Array) and RID (Refractive Index Detector)' }
//       ]
//     },
//     {
//       title: 'Particle Size Analyser (Zetasizer Nano)',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What are some specifications?', answer: 'Ans: Uses laser λ=633 nm, temp range 2°C–90°C' },
//         { question: 'Q2: What cuvettes are available?', answer: 'Ans: Quartz low volume, Disposable polystyrene, Multiuse folded capillary cuvettes' },
//         { question: 'Q3: What sample volume is needed?', answer: 'Ans: 1 ml (polystyrene cuvettes), 0.75 ml (capillary), 12 μL (quartz cell)' },
//         { question: 'Q4: What is a good concentration for my sample?', answer: 'Ans: Depends on optical properties, particle size and polydispersity' }
//       ]
//     },
//     {
//       title: 'Fluorescence Spectrometer',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What type of samples can be analyzed?', answer: 'Ans: Powder and Liquid samples' },
//         { question: 'Q2: How much sample is required?', answer: 'Ans: Powder: 200 mg; Liquid: 2 ml' },
//         { question: 'Q3: Do I need to provide excitation and emission ranges?', answer: 'Ans: Yes, user must provide specifications' },
//         { question: 'Q4: What if I don’t know the wavelength region?', answer: 'Ans: Run UV spectroscopy first; fluorescence will show where UV spectrum peaks.' }
//       ]
//     },
//     {
//       title: 'ICP-OES',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: Should I submit final dilution of prepared sample?', answer: 'Ans: Yes, only final diluted sample with digestion is accepted.' },
//         { question: 'Q2: What is the minimum quantity required?', answer: 'Ans: 40–50 ml final dilution' },
//         { question: 'Q3: Do I need reference standards for quantitative analysis?', answer: 'Ans: Yes, reference standards must be provided.' }
//       ]
//     },
//     {
//       title: 'Electrochemical Workstation',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: What areas are covered?', answer: 'Ans: Supercapacitors, Batteries, Biosensors, Corrosion, Electrodepositions' },
//         { question: 'Q2: Do you provide photo-sensitive measurements?', answer: 'Ans: No, light source not available currently.' },
//         { question: 'Q3: Which electrodes are provided?', answer: 'Ans: Ag/AgCl (reference), Platinum wire (counter), Glass carbon and carbon electrodes' },
//         { question: 'Q4: Do I need to provide measurement parameters?', answer: 'Ans: Yes, user must provide all parameters' },
//         { question: 'Q5: Do you prepare working electrodes?', answer: 'Ans: Normally user provides electrodes; in some cases team may prepare with extra charges.' },
//         { question: 'Q6: Can I reuse samples after analysis?', answer: 'Ans: Depends case by case, discuss with operator.' }
//       ]
//     },
//     {
//       title: 'Viscometer',
//       isOpen: false,
//       qanda: [
//         { question: 'Q1: Can I analyse solid samples?', answer: 'Ans: No, only liquid samples (free-flowing or slightly viscous)' },
//         { question: 'Q2: Can I analyse liquid samples at high temperature?', answer: 'Ans: No, only ambient temperature supported.' },
//         { question: 'Q3: How much quantity is required?', answer: 'Ans: At least 40–50 ml liquid sample' }
//       ]
//     }
//   ];
  

faqs = [
    {
      question: 'Field Emission Scanning Electron Microscope (FE SEM)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> How many samples can be submitted in a single request form?</dt>
          <dd><strong>Ans:</strong> Maximum of 5 samples</dd>
          <dt><strong>Q2:</strong> Does the Gold sputtering process affect the sample?</dt>
          <dd><strong>Ans:</strong> No, the process only creates a very thin coating on the sample surface to enhance the conductivity for good imaging.</dd>
          <dt><strong>Q3:</strong> What amount of sample is required for FESEM?</dt>
          <dd><strong>Ans:</strong> Powder: Minimum of 2.5 to 5mg. Film: Maximum allowed size 1cm x 1cm.</dd>
          <dt><strong>Q4:</strong> How will we come to know about the slot allocation?</dt>
          <dd><strong>Ans:</strong> The concerned operator/office assistant will intimate you at least a week before your slot by calling you.</dd>
        </dl>
      `
    },
    {
      question: 'UV-Vis Spectrophotometer',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What wavelength range is used for your UV-Vis instrument?</dt>
          <dd><strong>Ans:</strong> 200 nm to 800 nm</dd>
          <dt><strong>Q2:</strong> Can I reuse the sample after the analysis for other experiments?</dt>
          <dd><strong>Ans:</strong> Yes, if your sample is not UV sensitive you can reuse it. UV-Vis spectrometer analysis is a non-destructive method.</dd>
          <dt><strong>Q3:</strong> Is it necessary to provide final dilution of sample for UV analysis?</dt>
          <dd><strong>Ans:</strong> Yes, user must provide the sample in final diluted form.</dd>
        </dl>
      `
    },
    {
      question: 'Thermogravimetric Analysis (TGA)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> How much sample is required for TGA analysis?</dt>
          <dd><strong>Ans:</strong> 5–8mg</dd>
          <dt><strong>Q2:</strong> What is the normally used heating rate in TGA analysis?</dt>
          <dd><strong>Ans:</strong> 10°C/Min</dd>
          <dt><strong>Q3:</strong> Can we do TGA analysis of Liquid samples?</dt>
          <dd><strong>Ans:</strong> No! TGA analysis can only be performed on Powder or Film samples.</dd>
          <dt><strong>Q4:</strong> What is the maximum possible heating range of the TGA instrument available in CIF?</dt>
          <dd><strong>Ans:</strong> 1000°C</dd>
        </dl>
      `
    },
    {
      question: 'Differential Scanning Calorimeter (DSC)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> How much sample is required for DSC analysis?</dt>
          <dd><strong>Ans:</strong> 8–10mg</dd>
          <dt><strong>Q2:</strong> Which gases are used for the analysis process?</dt>
          <dd><strong>Ans:</strong> Nitrogen</dd>
          <dt><strong>Q3:</strong> Which type of sample pan is used in DSC?</dt>
          <dd><strong>Ans:</strong> Aluminium type</dd>
        </dl>
      `
    },
    {
      question: 'Powder X-ray Diffractometer (XRD)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> Can I use the sample after XRD analysis?</dt>
          <dd><strong>Ans:</strong> Yes! XRD is non-destructive. The sample can be reused.</dd>
          <dt><strong>Q2:</strong> I have an unknown mineral sample. Can I use XRD to identify it?</dt>
          <dd><strong>Ans:</strong> Yes! XRD can identify crystal patterns or phases. For better results, run XRF first to know composition.</dd>
          <dt><strong>Q3:</strong> Which databases are available?</dt>
          <dd><strong>Ans:</strong> ICSD, PDF2 ICDD (JCPDS), Software: Highscore Plus</dd>
          <dt><strong>Q4:</strong> What amount of sample is required?</dt>
          <dd><strong>Ans:</strong> Powder: Minimum 400–500 mg</dd>
        </dl>
      `
    },
    {
      question: 'FTIR Spectrometer',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What type of samples can be analyzed?</dt>
          <dd><strong>Ans:</strong> Powder and Liquid samples</dd>
          <dt><strong>Q2:</strong> Can we analyze liquid samples?</dt>
          <dd><strong>Ans:</strong> Yes</dd>
          <dt><strong>Q3:</strong> In which ranges can we obtain IR spectra?</dt>
          <dd><strong>Ans:</strong> 4000–400 cm-1</dd>
          <dt><strong>Q4:</strong> How much sample is required?</dt>
          <dd><strong>Ans:</strong> 5–10 mg</dd>
        </dl>
      `
    },
    {
      question: 'Gas Chromatography with Mass Spectrometry (GC-MS/MS)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> Can gas samples be analyzed?</dt>
          <dd><strong>Ans:</strong> No, only solid and liquid samples</dd>
          <dt><strong>Q2:</strong> Do I have to submit reference standards?</dt>
          <dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd>
          <dt><strong>Q3:</strong> Are results provided with library comparison?</dt>
          <dd><strong>Ans:</strong> Yes, NIST library comparison data is provided</dd>
          <dt><strong>Q4:</strong> Can direct injection mass spectra be obtained?</dt>
          <dd><strong>Ans:</strong> Yes, using MS/MS in CIF</dd>
        </dl>
      `
    },
    {
      question: 'High Performance Liquid Chromatography (HPLC)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What is the minimum quantity required?</dt>
          <dd><strong>Ans:</strong> Powder: 5–10 mg; Liquid: Minimum 2 ml final dilution</dd>
          <dt><strong>Q2:</strong> Do I have to submit reference standards?</dt>
          <dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd>
          <dt><strong>Q3:</strong> What detectors are available?</dt>
          <dd><strong>Ans:</strong> PDA (Photo Diode Array), RID (Refractive Index Detector)</dd>
        </dl>
      `
    },
    {
      question: 'Particle Size Analyser (Zetasizer Nano)',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What are some specifications?</dt>
          <dd><strong>Ans:</strong> Laser λ=633 nm, Temp 2°C–90°C</dd>
          <dt><strong>Q2:</strong> What cuvettes are available?</dt>
          <dd><strong>Ans:</strong> Quartz low volume, Disposable polystyrene, Folded capillary cuvettes</dd>
          <dt><strong>Q3:</strong> What sample volume is needed?</dt>
          <dd><strong>Ans:</strong> 1 ml (polystyrene), 0.75 ml (capillary), 12 μL (quartz)</dd>
          <dt><strong>Q4:</strong> What is a good concentration?</dt>
          <dd><strong>Ans:</strong> Depends on particle properties and polydispersity</dd>
        </dl>
      `
    },
    {
      question: 'Fluorescence Spectrometer',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What type of samples can be analyzed?</dt>
          <dd><strong>Ans:</strong> Powder and Liquid</dd>
          <dt><strong>Q2:</strong> How much sample is required?</dt>
          <dd><strong>Ans:</strong> Powder: 200 mg; Liquid: 2 ml</dd>
          <dt><strong>Q3:</strong> Do I need excitation/emission ranges?</dt>
          <dd><strong>Ans:</strong> Yes, must be provided</dd>
          <dt><strong>Q4:</strong> What if I don’t know the wavelength region?</dt>
          <dd><strong>Ans:</strong> Run UV spectroscopy first; fluorescence follows UV peaks</dd>
        </dl>
      `
    },
    {
      question: 'ICP-OES',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> Should I submit final dilution?</dt>
          <dd><strong>Ans:</strong> Yes, only final diluted sample with digestion is accepted</dd>
          <dt><strong>Q2:</strong> What is the minimum quantity required?</dt>
          <dd><strong>Ans:</strong> 40–50 ml final dilution</dd>
          <dt><strong>Q3:</strong> Do I need reference standards?</dt>
          <dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd>
        </dl>
      `
    },
    {
      question: 'Electrochemical Workstation',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> What areas are covered?</dt>
          <dd><strong>Ans:</strong> Supercapacitors, Batteries, Biosensors, Corrosion, Electrodepositions</dd>
          <dt><strong>Q2:</strong> Do you provide photo-sensitive measurements?</dt>
          <dd><strong>Ans:</strong> No, light source not available</dd>
          <dt><strong>Q3:</strong> Which electrodes are provided?</dt>
          <dd><strong>Ans:</strong> Ag/AgCl, Platinum wire, Glass carbon, Carbon electrodes</dd>
          <dt><strong>Q4:</strong> Do I need to provide parameters?</dt>
          <dd><strong>Ans:</strong> Yes, must be provided</dd>
          <dt><strong>Q5:</strong> Do you prepare working electrodes?</dt>
          <dd><strong>Ans:</strong> Normally provided by user; may be prepared with extra charges</dd>
          <dt><strong>Q6:</strong> Can I reuse samples?</dt>
          <dd><strong>Ans:</strong> Depends case by case; ask operator</dd>
        </dl>
      `
    },
    {
      question: 'Viscometer',
      isOpen: false,
      answer: `
        <dl>
          <dt><strong>Q1:</strong> Can I analyse solid samples?</dt>
          <dd><strong>Ans:</strong> No, only liquids (free-flowing or slightly viscous)</dd>
          <dt><strong>Q2:</strong> Can I analyse liquid samples at high temperature?</dt>
          <dd><strong>Ans:</strong> No, only ambient temperature</dd>
          <dt><strong>Q3:</strong> How much sample is required?</dt>
          <dd><strong>Ans:</strong> At least 40–50 ml liquid</dd>
        </dl>
      `
    }
  ];


  @ViewChild('chargesModal') chargesModal!: ElementRef;

  constructor(
    private CIFwebService: LpuCIFWebService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllInstruments();

    this.route.paramMap.subscribe((params) => {
      this.InstrumentId = Number(params.get('id'));
      this.categoryId = Number(params.get('categoryId'));
      if (this.InstrumentId && this.categoryId) {
        this.fetchSpecifications(this.categoryId, this.InstrumentId);
      }
    });
  }

  // ✅ Accordion toggle function
  toggleAccordion(faq: any): void {
    // console.log("Clicked:", faq.question, "Current state:", faq.isOpen);
    this.faqs.forEach(f => {
      if (f !== faq) f.isOpen = false;
    });
    faq.isOpen = !faq.isOpen;
    // console.log("New state:", faq.isOpen);
  }
  
  // Existing methods
  getAllInstruments(): void {
    this.CIFwebService.GetAllInstrumentsData().subscribe({
      next: response => {
        if (response.item1 && response.item1.length > 0) {
          this.cifInstrumentsDataData = response.item1;
          this.tmpscifInstrumentsDataData = response.item1;
        }
      },
      error: err => console.log(err)
    });
  }

  fetchSpecifications(categoryId: number, id: number): void {
    this.InstrumentId = id;
    this.CIFwebService.fetchSpecifications().subscribe({
      next: (response: any) => {
        if (response.item1?.length > 0) {
          const instrument = this.cifInstrumentsDataData.find(x => x.id == this.InstrumentId);

          if (instrument) {
            this.instrumentName = instrument.instrumentName;
            this.ImageUrl = instrument.imageUrl;
            this.Description = instrument.description;
            this.isInstrumentActive = instrument.isActive;
          }

          this.specifications = response.item1.filter((spec: any) => spec.categoryId === categoryId);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching specifications:', err)
    });
  }

  openChargesModal(id: number): void {
    this.getChargesDetails(id);
    this.modalService.open(this.chargesModal, { size: 'sm' });
  }

  getChargesDetails(Id: number): void {
    this.CIFwebService.GetChargesDetails(Id).subscribe({
      next: response => {
        if (response.item1?.length > 0) {
          this.cifInstrumentsCharges = response.item1;
        }
      },
      error: err => console.log(err)
    });
  }

  navigateToLogin(): void {
    this.modalService.dismissAll();
    this.router.navigate(['/Login']);
  }
}
