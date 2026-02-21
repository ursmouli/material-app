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
    FormsModule
],
  templateUrl: './pickup-point.component.html',
  styleUrl: './pickup-point.component.scss'
})
export class PickupPointComponent implements OnInit {

  pickupPointForm: FormGroup;
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
  
  constructor() {
    this.pickupPointForm = this.fb.group({
      stopName: [''],
      sequenceOrder: [0],
      address: [''],
      latitude: [0],
      longitude: [0],
    });
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

  isEditingRow(index: number): boolean {
    return this.editingRow === index;
  }

  editPickupPoint(pickupPoint: PickupPoint, index: number) {
    console.log('editPickupPoint', pickupPoint);
    this.editingRow = index;
  }

  deletePickupPoint(pickupPoint: PickupPoint, index: number) {
    console.log('deletePickupPoint', pickupPoint);
    this.editingRow = null;
  }

  addNewPickupPoint() {
    console.log('addNewPickupPoint');
    this.isNewRow = true;
    this.editingRow = null;
    this.pickupPointForm.reset();

    const newPoint: Partial<PickupPoint> = {
      stopName: '',
      sequenceOrder: 0,
      address: '',
      latitude: 0,
      longitude: 0,
    };
    
    this.pickupPointsDataSource.data = [newPoint as PickupPoint, ...this.pickupPointsDataSource.data];
    this.editingRow = 0;
  }

  async saveNewPickupPoint() {
    console.log('saveNewPickupPoint');
    if (this.pickupPointForm.invalid) {
      return;
    }

    const newPickupPoint: PickupPoint = {
      ...this.pickupPointForm.value,
      route: { id: this.selectedRouteId } as VehicleRoute,
    };
    
    // TODO: Save the new pickup point to the backend
    console.log('Saving new pickup point:', newPickupPoint);

    try {
      const savedPickupPoint = await this.pickupPointService.addStop(newPickupPoint);
      console.log('Saved pickup point:', savedPickupPoint);

      if (savedPickupPoint) {
        this.reset();

        this.pickupPointsDataSource.data[0] = savedPickupPoint;
        this.pickupPointsDataSource.data = [...this.pickupPointsDataSource.data];

        this.notificationService.showNotification('Section saved successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving pickup point:', error);
      this.notificationService.showNotification('Error saving section', 'error');
    }
  }

  reset() {
    this.pickupPointForm.reset();
    this.isNewRow = false;
    this.editingRow = null;
  }

  async updatePickupPoint(pickupPoint: PickupPoint, index: number) {
    console.log('updatePickupPoint', pickupPoint);
    this.editingRow = index;
    this.pickupPointForm.patchValue(pickupPoint);
  }

  cancelEditPickupPoint(index: number) {
    console.log('cancelEditPickupPoint');

    if (this.isNewRow) {
      this.pickupPointsDataSource.data = this.pickupPointsDataSource.data.filter((_, i) => i !== index);
      this.isNewRow = false;
    }

    this.editingRow = null;
    this.pickupPointForm.reset();
  }

}


