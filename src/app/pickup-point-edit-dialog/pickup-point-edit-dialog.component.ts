import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PickupPoint, VehicleRoute } from '../common/model/transport-models';
import { PickupPointService } from '../common/services/pickup-point.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pickup-point-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule
],
  templateUrl: './pickup-point-edit-dialog.component.html',
  styleUrl: './pickup-point-edit-dialog.component.scss'
})
export class PickupPointEditDialogComponent implements OnInit {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<PickupPointEditDialogComponent>);

  fb = inject(FormBuilder);

  pickupPointService = inject(PickupPointService);

  public pickupPointForm!: FormGroup;

  isEdit = false;
  vehicleRoute: VehicleRoute = {} as VehicleRoute;
  pickupPoint: PickupPoint = {} as PickupPoint;

  existingStopNames: string[] = [];

  ngOnInit(): void {
    console.log(this.data);

    if (this.data?.existingStopNames) {
      this.existingStopNames = this.data.existingStopNames;
    }
    if (this.data?.vehicleRoute) {
      this.vehicleRoute = this.data.vehicleRoute;
    }
    if (this.data?.pickupPoint) {
      this.isEdit = true;
      this.pickupPoint = this.data.pickupPoint;
    }

    this.pickupPointForm = this.fb.group({
      stopName: ['', [Validators.required, duplicateStopNameValidator(this.existingStopNames, this.isEdit, this.pickupPoint?.stopName)]],
      sequenceOrder: ['', [Validators.required]],
      address: [''],
      latitude: [0],
      longitude: [0],
    });

    if (this.data?.pickupPoint) {
      this.pickupPointForm.patchValue(this.data.pickupPoint);
    }    
  }

  onSave() {
    if (this.pickupPointForm.invalid) {
      this.pickupPointForm.markAllAsTouched();
      return;
    }

    const pickupPoint = this.pickupPointForm.value as PickupPoint;
    pickupPoint.route = this.vehicleRoute;

    if (this.isEdit) {
      pickupPoint.id = this.data.pickupPoint.id;

      console.log('Updating pickup point', pickupPoint);
      this.pickupPointService.updateStop(pickupPoint).then((result) => {
        this.dialogRef.close(result);
      });
    } else {
      this.pickupPointService.addStop(pickupPoint).then((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}

export function duplicateStopNameValidator(existingStopNames: string[], isEdit: boolean, currentStopName?: string): ValidatorFn {
  return (control) => {
    if (control.touched && control.value) {
      if (isEdit && currentStopName === control.value) {
        return null;
      }
      if (existingStopNames.includes(control.value)) {
        return { duplicateStopName: true };
      }
    }
    return null;
  };
}
