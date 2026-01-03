import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { MatCard, MatCardModule } from "@angular/material/card";

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
    MatCardModule
],
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.scss'
})
export class StudentRegistrationComponent {
  studentForm: FormGroup;

  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      permanentAddress: this.createAddressFormGroup(),
      residentialAddress: this.createAddressFormGroup(),
      guardian: this.fb.group({
        type: ['', Validators.required],
        name: ['', Validators.required]
      }),
      siblings: this.fb.array([])
    });
  }

  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      houseNumber: [''],
      plotNumber: [''],
      landMark: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      taluk: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  get siblings(): FormArray {
    return this.studentForm.get('siblings') as FormArray;
  }

  addSibling() {
    this.siblings.push(this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      previousSchoolName: [''],
      place: ['']
    }));
  }

  removeSibling(index: number) {
    this.siblings.removeAt(index);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      console.log(this.studentForm.value);
      // Handle form submission
    }
  }
}
