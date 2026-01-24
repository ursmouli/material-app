import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { MatCard, MatCardModule } from "@angular/material/card";
import { LocationService } from '../common/services/location.service';
import { StudentService } from '../common/services/student.service';
import { State } from '../common/model/state';
import { pipe, tap, from, BehaviorSubject } from 'rxjs';
import { Country } from '../common/model/country';
import { District } from '../common/model/district';
import { Taluk } from '../common/model/taluk';
import { Student } from '../common/model/student';
import { PropertiesService } from '../common/services/properties.service';
import { Relation } from '../common/model/relations';
import { Address } from '../common/model/address';
import { ageBeforeValidator } from '../common/validators/form-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    WebcamModule,
    MatCardModule,
    MatButtonToggleModule,
    MatRadioModule
  ],
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.scss'
})
export class StudentRegistrationComponent implements OnInit {

  locationService = inject(LocationService);
  studentService = inject(StudentService);
  propertiesService = inject(PropertiesService);

  // countries$ = this.locationService.getCountries();
  pIndianStates$ = new BehaviorSubject<State[]>([]);
  pStateDistricts$ = new BehaviorSubject<District[]>([]);
  pDistrictTaluks$ = new BehaviorSubject<Taluk[]>([]);

  rIndianStates$ = new BehaviorSubject<State[]>([]);
  rStateDistricts$ = new BehaviorSubject<District[]>([]);
  rDistrictTaluks$ = new BehaviorSubject<Taluk[]>([]);

  relationshipTypes$ = new BehaviorSubject<string[]>([]);


  selectedCountry!: Country;

  studentForm: FormGroup;
  cutoffDate = new Date();

  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.cutoffDate.setFullYear(this.cutoffDate.getFullYear() - 6);
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      dob: ['', [Validators.required, ageBeforeValidator(this.cutoffDate)]],
      gender: ['', Validators.required],
      bloodGroup: [''],
      permanentAddress: this.createAddressFormGroup(),
      residentialAddress: this.createAddressFormGroup(),
      isResidentialSameAsPermanent: ['yes'],
      guardian: this.fb.group({
        relation: ['', Validators.required],
        name: ['', [Validators.required, Validators.minLength(3)]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]]
      }),
      siblings: this.fb.array([])
    });
  }

  async ngOnInit(): Promise<void> {
    this.resetResidentialAddress();
    
    const relationships: string[] = await this.propertiesService.fetchRelationships();
    this.relationshipTypes$.next(relationships);

    let countries = await this.locationService.getCountries();

    countries.forEach(country => {
      if (country.name.toLocaleLowerCase() === 'india') {
        this.selectedCountry = country;

        this.studentForm.patchValue({
          permanentAddress: { country: this.selectedCountry?.id },
          residentialAddress: { country: this.selectedCountry?.id }
        });

        this.locationService.getStates(this.selectedCountry.id).then(states => {
          // console.log(states);
          this.pIndianStates$.next(states);
          this.rIndianStates$.next(states);

          const defaultState = states.find(s => s.name.toLowerCase() === 'karnataka');

          if (defaultState) {
            this.studentForm.patchValue({
              permanentAddress: { state: defaultState.id },
              residentialAddress: { state: defaultState.id }
            });
            this.loadDistricts(defaultState.id, true);
            this.loadDistricts(defaultState.id, false);
          }
        });
      }
    });


    // Listen to state changes in permanent address
    this.studentForm.get('permanentAddress.state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.loadDistricts(stateId, true);
      }
    });

    // Listen to district changes in permanent address
    this.studentForm.get('permanentAddress.district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.loadTaluk(districtId, true);
      }
    });

    // Listen to state changes in residential address
    this.studentForm.get('residentialAddress.state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.loadDistricts(stateId, false);
      }
    });

    // Listen to district changes in residential address
    this.studentForm.get('residentialAddress.district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.loadTaluk(districtId, false);
      }
    });

    this.studentForm.get('isResidentialSameAsPermanent')?.valueChanges.subscribe(value => {
      const resAddr = this.studentForm.get('residentialAddress');

      if (value === 'yes') {
        resAddr?.clearValidators();
        resAddr?.reset();
        resAddr?.disable();
      } else {
        // Re-apply validation and enable
        resAddr?.setValidators([
          Validators.required,
          Validators.minLength(3)
        ]);
        resAddr?.enable();
      }
    });
  }

  resetResidentialAddress() {
    const resAddr = this.studentForm.get('residentialAddress');
    if (resAddr) {
      resAddr.reset();
      resAddr.disable();
    }
  }

  async loadDistricts(stateId: number, isPermanenetAddress: boolean) {
    try {
      const districts = await this.locationService.getDistricts(stateId);
      if (isPermanenetAddress) {
        this.pStateDistricts$.next(districts);
      } else {
        this.rStateDistricts$.next(districts);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
      if (isPermanenetAddress) {
        this.pStateDistricts$.next([]);
      } else {
        this.rStateDistricts$.next([]);
      }
    }
  }

  async loadTaluk(districtId: number, isPermanenetAddress: boolean) {
    try {
      const taluks = await this.locationService.getTaluks(districtId);
      if (isPermanenetAddress) {
        this.pDistrictTaluks$.next(taluks);
      } else {
        this.rDistrictTaluks$.next(taluks);
      }
    } catch (error) {
      console.error('Error loading taluks:', error);
      if (isPermanenetAddress) {
        this.pDistrictTaluks$.next([]);
      } else {
        this.rDistrictTaluks$.next([]);
      }
    }
  }

  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      houseNumber: [''],
      street: [''],
      landMark: [''],
      postalCode: [''],
      place: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      taluk: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      country: ['']
    });
  }

  get siblings(): FormArray {
    return this.studentForm.get('siblings') as FormArray;
  }

  addSibling() {
    this.siblings.push(this.fb.group({
      relation: ['', Validators.required],
      name: ['', Validators.required],
      dob: ['', Validators.required],
      institutionName: [''],
      institutionPlace: ['']
    }));
  }

  removeSibling(index: number) {
    this.siblings.removeAt(index);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      // console.log(this.studentForm.value);

      const student: Student = {
        firstName: this.studentForm.get('firstName')?.value,
        lastName: this.studentForm.get('lastName')?.value,
        middleName: this.studentForm.get('middleName')?.value,
        gender: this.studentForm.get('gender')?.value,
        dob: this.studentForm.get('dob')?.value,
        bloodGroup: this.studentForm.get('bloodGroup')?.value,
        permanentAddress: this.mapAddress(this.studentForm.get('permanentAddress')?.value),
        residentialAddress: this.mapAddress(this.studentForm.get('residentialAddress')?.value),
        sameAsPermanentAddress: this.studentForm.get('isResidentialSameAsPermanent')?.value === 'yes' ? true : false,
        guardians: this.mapGuardians(this.studentForm.get('guardian')?.value),
        siblings: this.studentForm.get('siblings')?.value
      };

      console.log(student);

      this.studentService.registerStudent(student).then((response) => {
        // redirect to student-list
        this.router.navigate(['/student-list']);
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  private mapGuardians(guardian: any) {
    return [
      {
        name: guardian.name,
        email: guardian.email,
        phone: guardian.phone,
        relation: guardian.relation
      }
    ]
  }

  private mapAddress(address: any): Address {
    return {
      houseNumber: address.houseNumber,
      street: address.street,
      landmark: address.landMark,

      place: address.place,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,

      countryId: address.country,
      stateId: address.state,
      districtId: address.district,
      talukId: address.taluk,
    };
  }
}
