import { Component, inject, OnInit } from '@angular/core';
import { PickupPointService } from '../common/services/pickup-point.service';
import { VehicleRouteService } from '../common/services/vehicle-route.service';
import { PickupPoint, VehicleRoute } from '../common/model/transport-models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../common/services/notification.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { PickupPointEditDialogComponent } from '../pickup-point-edit-dialog/pickup-point-edit-dialog.component';
import { AddLocationDialogComponent } from '../location/add-location-dialog/add-location-dialog.component';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-pickup-point',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatDialogModule
],
  templateUrl: './pickup-point.component.html',
  styleUrl: './pickup-point.component.scss'
})
export class PickupPointComponent implements OnInit {
  fb = inject(FormBuilder);

  searchTerm: string = '';
  selectedRouteId: number | null = null;

  editingRow: number | null = null;
  isNewRow: boolean = false;

  pickupPoints: PickupPoint[] = [];
  vehicleRoutes: VehicleRoute[] = [];

  private pickupPointService = inject(PickupPointService);
  private vehichleRouteService = inject(VehicleRouteService);
  private notificationService = inject(NotificationService);

  pickupPointsDataSource = new MatTableDataSource<PickupPoint>();
  displayedColumns: string[] = ['stopName', 'sequenceOrder', 'address', 'latitude', 'longitude', 'actions'];

  editDialog = inject(MatDialog);
  
  constructor() {
  }

  ngOnInit(): void {
    this.vehichleRouteService.getRoutes().then((routes) => {
      this.vehicleRoutes = routes;
      console.log('vehicleRoutes', routes);
    });
  }

  searchPickupPoints() {
    console.log('searchPickupPoints', this.searchTerm);
  }

  onRouteChange(event: any) {
    console.log('onRouteChange', event);
    this.selectedRouteId = event.value;
    this.pickupPointService.findByRoute(event.value).then((stops) => {
      this.pickupPoints = stops;
      this.pickupPointsDataSource.data = stops;
      console.log('pickupPoints', stops);
    });
  }

  deletePickupPoint(pickupPoint: PickupPoint, index: number) {
    console.log('deletePickupPoint', pickupPoint);
    
    
    const dialogRef = this.editDialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {
        message: `Are you sure you want to delete this pickup point '${pickupPoint.stopName}'?`
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pickupPointService.delete(pickupPoint.id!).then((response) => {
          this.notificationService.showNotification(response['message'], 'success');
          this.pickupPointsDataSource.data = this.pickupPoints.filter(p => p.id !== pickupPoint.id);
        });
      }
    });
  }

  addNewPickupPoint() {
    const pickupPoint: PickupPoint | null = null;
    
    this.dialogOpen(pickupPoint, undefined);
  }

  dialogOpen(pickupPoint: PickupPoint | null, index: number | undefined) {

    const existingStopNames = this.pickupPoints.map((stop) => stop.stopName);
    const dialogRef = this.editDialog.open(PickupPointEditDialogComponent, {
      width: '500px',
      data: {
        pickupPoint: pickupPoint,
        vehicleRoute: this.vehicleRoutes.find(route => route.id === this.selectedRouteId),
        existingStopNames: existingStopNames
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef.afterClosed', result);
      console.log('index', index);
      if (result) {
        if (index !== undefined) {
          this.pickupPointsDataSource.data[index] = result;
          this.pickupPointsDataSource.data = [...this.pickupPointsDataSource.data];

          const pickupPointIndex = this.pickupPoints.findIndex(p => p.id === pickupPoint!.id);
          if (pickupPointIndex !== -1) {
            this.pickupPoints[pickupPointIndex] = result;
          }
        } else {
          this.pickupPointsDataSource.data = [result as PickupPoint, ...this.pickupPointsDataSource.data];
        }
      }
    });
  }

  async updatePickupPoint(pickupPoint: PickupPoint, index: number) {
    console.log('updatePickupPoint', pickupPoint);
    
    this.dialogOpen(pickupPoint, index);
  }

}


