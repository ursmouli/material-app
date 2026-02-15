import { Component, inject, OnInit } from '@angular/core';
import { VehicleService } from '../common/services/vehicle.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Vehicle } from '../common/model/transport-models';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

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

  vehicleService = inject(VehicleService);

  vehicleDataSource = new MatTableDataSource<Vehicle>();
  displayedColumns: string[] = ['registrationNumber', 'capacity', 'driverName', 'driverContact', 'status', 'make', 'drivingLicense', 'actions'];

  ngOnInit(): void {
    this.vehicleService.getVehicles().then(vehicles => {
      this.vehicleDataSource.data = vehicles;
    });
  }

}
