import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RolesService } from '../common/services/roles.service';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent implements OnInit {

  rolesService = inject(RolesService);
  fb = inject(FormBuilder);

  employeeForm!: FormGroup;
  roles: string[] = [];

  ngOnInit() {
    this.rolesService.getRoles().then(roles => this.roles = roles);
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      role: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      residentialAddress: ['', Validators.required],
      father: [''],
      mother: [''],
      spouse: [''],
      kids: [''],
      previousEmployment: ['']
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
      // Handle form submission
    }
  }

}
