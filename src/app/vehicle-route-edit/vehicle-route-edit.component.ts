import { Component, inject, OnInit } from '@angular/core';
import { VehicleRouteService } from '../common/services/vehicle-route.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService } from '../common/services/vehicle.service';
import { Vehicle, VehicleRoute } from '../common/model/transport-models';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

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
    MatSelectModule
  ],
  templateUrl: './vehicle-route-edit.component.html',
  styleUrl: './vehicle-route-edit.component.scss'
})
export class VehicleRouteEditComponent implements OnInit {

  isEditMode = false;

  routeId: number | null = null;

  router = inject(Router);
  route = inject(ActivatedRoute);
  routeService = inject(VehicleRouteService);
  vehicleService = inject(VehicleService);

  routeForm: FormGroup;
  fb = inject(FormBuilder);

  vehicles: Vehicle[] = [];

  constructor() {
    this.routeForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: [''],
      price: [''],
      vehicleId: ['', [Validators.required]],
      distance: [''],
      pointA: [''],
      pointB: [''],
      pointALatitude: [''],
      pointALongitude: [''],
      pointBLatitude: [''],
      pointBLongitude: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    // Get route ID from route parameters
    this.routeId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

    this.vehicles = await this.vehicleService.getVehicles();

    if (this.routeId) {
      this.isEditMode = true;

      const route = await this.routeService.getRouteById(this.routeId);

      console.log('route', route);

      const vehicleId = route?.vehicle?.id;
      this.routeForm.patchValue({ ...route, vehicleId });
    }
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      const route = this.routeForm.value;

      const routeData: VehicleRoute = {
        ...route,
        vehicle: this.vehicles.find(v => v.id === route.vehicleId)
      };

      if (this.isEditMode && this.routeId) {
        this.routeService.updateRoute(this.routeId, routeData).then(() => {
          this.router.navigate(['/admin/routes']);
        });
      } else {
        this.routeService.addRoute(routeData).then(() => {
          this.router.navigate(['/admin/routes']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/routes']);
  }

}
