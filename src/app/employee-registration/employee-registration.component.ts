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
import { PropertiesService } from '../common/services/properties.service';
import { EmployeeService } from '../common/services/employee.service';
import { LocationService } from '../common/services/location.service';
import { Country } from '../common/model/country';
import { AddressFormHandler } from '../common/base/address-form-handler';
import { AddressFormComponent } from '../common/address-form/address-form.component';
import { Address } from '../common/model/address';
import { Router } from '@angular/router';
import { Employee } from '../common/model/registration';

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

  router = inject(Router);
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

      const employee: Employee = {
        firstName: this.employeeForm.get('firstName')?.value,
        lastName: this.employeeForm.get('lastName')?.value,
        middleName: this.employeeForm.get('middleName')?.value,
        gender: this.employeeForm.get('gender')?.value,
        dob: this.employeeForm.get('dob')?.value,
        bloodGroup: this.employeeForm.get('bloodGroup')?.value,
        permanentAddress: this.mapPermanentAddress(this.employeeForm.get('permanentAddress')?.value),
        residentialAddress: this.mapOptionalAddress(this.employeeForm.get('residentialAddress')?.value),
        sameAsPermanentAddress: this.employeeForm.get('isResidentialSameAsPermanent')?.value === 'yes' ? true : false,
        guardians: this.mapGuardians(this.employeeForm.get('guardian')?.value),
        siblings: this.employeeForm.get('siblings')?.value,
        previousEmployment: this.employeeForm.get('previousEmployment')?.value,
        maritalStatus: this.employeeForm.get('maritalStatus')?.value,
        role: this.employeeForm.get('role')?.value
      };

      if (employee.sameAsPermanentAddress) {
        employee.residentialAddress = undefined;
      }

      // console.log(employee);

      this.employeeService.registerEmployee(employee).then((response) => {
        // redirect to student-list
        this.router.navigate(['/admin/employee-list']);
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

  private mapPermanentAddress(address: any): Address {
    if (!address) {
      throw new Error('Permanent address is required');
    }

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

  private mapOptionalAddress(address: any): Address | undefined {
    if (!address) {
      return undefined;
    }

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
