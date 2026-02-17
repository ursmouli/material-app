import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../common/services/vehicle.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from '../common/model/transport-models';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})
export class EditVehicleComponent implements OnInit {

  isEditMode = false;
  vehicleForm: FormGroup;

  vehicleService = inject(VehicleService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);

  constructor() {
    this.vehicleForm = this.fb.group({
      id: [''],
      registrationNumber: [''],
      capacity: [''],
      driverName: ['']
    }); 
  }

  ngOnInit(): void {
    const resolvedData: Vehicle = this.activatedRoute.snapshot.data['vehicleData'];
    console.log('Resolved Vehicle Data: ', resolvedData);

    if (resolvedData) {
      this.vehicleForm?.patchValue({
        id: resolvedData.id,
        registrationNumber: resolvedData.registrationNumber,
        capacity: resolvedData.capacity,
        driverName: resolvedData.driverName
      })
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit() {
    if (this.vehicleForm?.valid) {
      if (this.isEditMode) {
        this.vehicleService.updateVehicle(this.vehicleForm?.value).then(() => {
          this.router.navigate(['/admin/vehicles']);
        });
      } else {
        this.vehicleService.addVehicle(this.vehicleForm?.value).then(() => {
          this.router.navigate(['/admin/vehicles']);
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/admin/vehicles']);
  }

}
