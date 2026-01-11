import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    ReactiveFormsModule],
  templateUrl: './add-location-dialog.component.html',
  styleUrl: './add-location-dialog.component.scss'
})
export class AddLocationDialogComponent implements OnInit {

  public data = inject(MAT_DIALOG_DATA) as Location | any;
  private dialogRef = inject(MatDialogRef<AddLocationDialogComponent>);

  private fb = inject(FormBuilder);

  // Define the form group
  locationForm!: FormGroup;

  // existingCodes = !this.data ? [] : this.data?.locations.map((loc: any) => loc.code);
  // existingNames = !this.data ? [] : this.data?.locations.map((loc: any) => loc.name);
  existingCodes = [];
  existingNames = [];

  ngOnInit() {
    console.log('Data received in dialog:', this.data);
    if (this.data) {
      const currLocations = this.data['locations'] || [];
      this.existingCodes = currLocations
        .map((loc: any) => loc.code)
        .filter((code: string) => code !== this.data.code);
      this.existingNames = currLocations
        .map((loc: any) => loc.name)
        .filter((name: string) => name !== this.data.name);
    }

    this.locationForm = this.fb.group({
      name: [this.data?.name || '', [
        Validators.required, 
        Validators.minLength(3), 
        duplicateNameValidator(this.existingNames)
      ]],
      code: [this.data?.code || '', [
        Validators.required, 
        Validators.minLength(3), 
        duplicateCodeValidator(this.existingCodes)
      ]]
    });
  }

  onSave() {
    // Pass back the data to the calling component
    if (this.locationForm.valid) {
      console.log('Form Value:', this.locationForm.value);
      this.dialogRef.close(this.locationForm.value);
    }
  }
}

export function duplicateCodeValidator(existingCodes: string[]): ValidatorFn {
  return (control) => {
    if (control.value && existingCodes.includes(control.value)) {
      return { duplicateCode: true };
    }
    return null;
  };
}

export function duplicateNameValidator(existingNames: string[]): ValidatorFn {
  return (control) => {
    if (control.value && existingNames.includes(control.value)) {
      return { duplicateName: true };
    }
    return null;
  };
}