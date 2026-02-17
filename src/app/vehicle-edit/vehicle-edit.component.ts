

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../common/model/transport-models';
import { VehicleService } from '../common/services/vehicle.service';


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
  templateUrl: './vehicle-edit.component.html',
  styleUrl: './vehicle-edit.component.scss'
})
export class VehicleEditComponent implements OnInit {

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
      });
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
