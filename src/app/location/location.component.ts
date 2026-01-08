import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Location {
  country: string;
  state: string;
  district: string;
  taluk: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  displayedColumns: string[] = ['country', 'state', 'district', 'taluk', 'actions'];
  dataSource: Location[] = [
    { country: 'India', state: 'Karnataka', district: 'Bangalore', taluk: 'Bangalore North' },
    { country: 'India', state: 'Tamil Nadu', district: 'Chennai', taluk: 'T. Nagar' },
    // Add more sample data as needed
  ];

  editingIndex: number | null = null;
  originalLocation: Location | null = null;

  countries = ['India', 'USA', 'UK'];
  states = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'];

  addLocation() {
    const newLocation: Location = {
      country: '',
      state: '',
      district: '',
      taluk: ''
    };
    this.dataSource = [...this.dataSource, newLocation];
    this.editingIndex = this.dataSource.length - 1;
    this.originalLocation = { ...newLocation };
  }

  editLocation(index: number) {
    this.editingIndex = index;
    this.originalLocation = { ...this.dataSource[index] };
  }

  saveLocation(index: number) {
    this.editingIndex = null;
    this.originalLocation = null;
    // Here you can add logic to save to backend
  }

  cancelEdit(index: number) {
    if (this.originalLocation) {
      this.dataSource[index] = { ...this.originalLocation };
    }
    this.editingIndex = null;
    this.originalLocation = null;
  }

  deleteLocation(index: number) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
  }
}
