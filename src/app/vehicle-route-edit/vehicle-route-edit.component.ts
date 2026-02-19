import { Component, inject, OnInit } from '@angular/core';
import { VehicleRouteService } from '../common/services/vehicle-route.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-route-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './vehicle-route-edit.component.html',
  styleUrl: './vehicle-route-edit.component.scss'
})
export class VehicleRouteEditComponent implements OnInit {

  isEditMode = false;

  routeId: number | null = null;
  routeService = inject(VehicleRouteService);

  routeForm: FormGroup;
  fb = inject(FormBuilder);
  /*
  id?: number;
    name: string;
    description?: string;
    price?: number;
    distance?: number;
    vehicle: Vehicle,
    pointA?: string,
    pointB?: string,
    pointALatitude?: number,
    pointALongitude?: number,
    pointBLatitude?: number,
    pointBLongitude?: number,
  */

  constructor() {
    this.routeForm = this.fb.group({
      id: [null],
      name: [''],
      description: [''],
      price: [''],
      vehicleId: [''],
      distance: [''],
      pointA: [''],
      pointB: [''],
      pointALatitude: [''],
      pointALongitude: [''],
      pointBLatitude: [''],
      pointBLongitude: ['']
    });
  }

  ngOnInit(): void {
    // Get route ID from route parameters
    // this.routeId = this.route.snapshot.paramMap.get('id');
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      console.log(this.routeForm.value);
    }
  }

  onCancel(): void {
    console.log('Cancel clicked');
  }

}
