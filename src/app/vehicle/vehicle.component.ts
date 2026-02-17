import { Component, inject, OnInit } from '@angular/core';
import { VehicleService } from '../common/services/vehicle.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Vehicle } from '../common/model/transport-models';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit {

  vehiclesData: Vehicle[] = [];

  vehicleService = inject(VehicleService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  searchValue = '';
  searchSubject = new BehaviorSubject<string>('');

  vehicleDataSource = new MatTableDataSource<Vehicle>();
  displayedColumns: string[] = ['registrationNumber', 'capacity', 'driverName', 'driverContact', 'status', 'make', 'drivingLicense', 'actions'];

  ngOnInit(): void {
    this.loadVehicles();

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.searchVehicles(searchValue);
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().then(vehicles => {
      this.vehicleDataSource.data = vehicles;
      this.vehiclesData = vehicles;
    });
  }

  searchVehicles(searchValue: string) {
    if (!searchValue) {
      this.vehicleDataSource.data = this.vehiclesData;
      return;
    }
    const filteredVehicles = this.vehiclesData.filter(vehicle =>
      vehicle.registrationNumber.toLowerCase().includes(searchValue.toLowerCase())
      || vehicle.driverName?.toLowerCase().includes(searchValue.toLowerCase())
      || vehicle.driverContact?.toLowerCase().includes(searchValue.toLowerCase())
      || vehicle.make?.toLowerCase().includes(searchValue.toLowerCase())
      || vehicle.drivingLicense?.toLowerCase().includes(searchValue.toLowerCase())
    );
    this.vehicleDataSource.data = filteredVehicles;
  }

  onEditVehicle(vehicleId: number) {
    this.router.navigate(['/admin/vehicle/edit', vehicleId]);
  }

  onAddVehicle() {
    this.router.navigate(['/admin/vehicle/add']);
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue);
  }

}
