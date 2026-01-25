import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RolesService } from '../common/services/roles.service';
import { CommonModule } from '@angular/common';
import { Role } from '../common/model/role';
import { BehaviorSubject } from 'rxjs';
import { State } from '../common/model/state';
import { District } from '../common/model/district';
import { Taluk } from '../common/model/taluk';
import { PropertiesService } from '../common/services/properties.service';
import { EmployeeService } from '../common/services/employee.service';
import { LocationService } from '../common/services/location.service';
import { Country } from '../common/model/country';
import { AddressFormHandler } from '../common/base/address-form-handler';
import { AddressFormComponent } from '../common/address-form/address-form.component';

@Component({
  selector: 'app-employee-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    AddressFormComponent
  ],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent extends AddressFormHandler implements OnInit {

  rolesService = inject(RolesService);
  propertiesService = inject(PropertiesService);
  employeeService = inject(EmployeeService);
  override locationService = inject(LocationService);
  override fb = inject(FormBuilder);

  employeeForm!: FormGroup;
  // roles: Role[] = [];
  roles$ = new BehaviorSubject<Role[]>([]);

  // Location data BehaviorSubjects are inherited from AddressFormHandler
  relationshipTypes$ = new BehaviorSubject<string[]>([]);

  cutoffDate = new Date();

  override selectedCountry!: Country;

  // Getter properties for address form groups
  get permanentAddress(): FormGroup {
    return this.employeeForm.get('permanentAddress') as FormGroup;
  }

  get residentialAddress(): FormGroup {
    return this.employeeForm.get('residentialAddress') as FormGroup;
  }

  constructor() {
    super();
    this.cutoffDate.setFullYear(this.cutoffDate.getFullYear() - 6);
    
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      role: ['', Validators.required],
      permanentAddress: this.createAddressFormGroup(),
      residentialAddress: this.createAddressFormGroup(),
      isResidentialSameAsPermanent: ['yes'],
      guardian: this.fb.group({
        relation: ['', Validators.required],
        name: ['', [Validators.required, Validators.minLength(3)]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]]
      }),
      siblings: this.fb.array([]),
      previousEmployment: [''],
      maritalStatus: ['single', Validators.required],
      gender: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.resetResidentialAddress();
    
    const relationships: string[] = await this.propertiesService.fetchRelationships();
    this.relationshipTypes$.next(relationships);

    const roles = await this.rolesService.getRoles();
    console.log('Roles:', roles);
    this.roles$.next(roles);

    // Initialize address form using abstract class
    // this.initializeAddressForm(this.employeeForm);


    // Setup address form subscriptions using abstract class
    // this.setupAddressStateSubscriptions(
    //   this.employeeForm,
    //   (stateId, isPermanent) => this.loadDistricts(stateId, isPermanent),
    //   (districtId, isPermanent) => this.loadTaluk(districtId, isPermanent)
    // );

    // Setup residential address sync
    this.setupResidentialAddressSync(this.employeeForm);
  }

  override resetResidentialAddress() {
    super.resetResidentialAddress(this.employeeForm);
  }

  get siblings(): FormArray {
    return this.employeeForm.get('siblings') as FormArray;
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
    if (this.employeeForm.valid) {
      // console.log(this.employeeForm.value);
      // Handle form submission
    }
  }

}
