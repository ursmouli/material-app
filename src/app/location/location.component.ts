import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardActions, MatCardModule } from "@angular/material/card";
import { Country } from '../common/model/country';

export interface Location {
  country: string;
  state: string;
  district: string;
  taluk: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatCardActions,
    MatCardModule
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  // displayedColumns: string[] = ['country', 'state', 'district', 'taluk', 'actions'];
  // dataSource: Location[] = [
  //   { country: 'India', state: 'Karnataka', district: 'Bangalore', taluk: 'Bangalore North' },
  //   { country: 'India', state: 'Tamil Nadu', district: 'Chennai', taluk: 'T. Nagar' },
  //   // Add more sample data as needed
  // ];

  selectedLocationType: string = 'country';

  editingIndex: number | null = null;
  originalLocation: Location | null = null;

  // countries = ['India', 'USA', 'UK'];
  countries: Country[] = [
    { id: 1, code: 'IN', name: 'India' },
    { id: 2, code: 'US', name: 'USA' },
    { id: 3, code: 'UK', name: 'United Kingdom' }
  ];
  countriesDataSource = new MatTableDataSource<Country>(this.countries);
  displayedCountryColumns: string[] = ['id', 'code', 'name', "actions"];

  
  states = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'];

  addLocation() {
    const newLocation: Location = {
      country: '',
      state: '',
      district: '',
      taluk: ''
    };
    // this.dataSource = [...this.dataSource, newLocation];
    // this.editingIndex = this.dataSource.length - 1;
    this.originalLocation = { ...newLocation };
  }

  editLocation(index: number) {
    this.editingIndex = index;
    // this.originalLocation = { ...this.dataSource[index] };
  }

  saveLocation(index: number) {
    this.editingIndex = null;
    this.originalLocation = null;
    // Here you can add logic to save to backend
  }

  cancelEdit(index: number) {
    if (this.originalLocation) {
      // this.dataSource[index] = { ...this.originalLocation };
    }
    this.editingIndex = null;
    this.originalLocation = null;
  }

  deleteLocation(index: number) {
    // this.dataSource.splice(index, 1);
    // this.dataSource = [...this.dataSource];
  }

  editCountry(index: number) {
    this.editingIndex = index;
    // this.originalLocation = { ...this.countriesDataSource.data[index] };
  }

  deleteCountry(index: number) {
    this.countriesDataSource.data.splice(index, 1);
    this.countriesDataSource._updateChangeSubscription();
  }
}
