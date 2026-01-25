import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardActions, MatCardModule } from "@angular/material/card";
import { Country } from '../common/model/country';
import { LocationService } from '../common/services/location.service';
import { State } from '../common/model/state';
import { District } from '../common/model/district';
import { Taluk } from '../common/model/taluk';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddLocationDialogComponent } from './add-location-dialog/add-location-dialog.component';

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
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  private locationService = inject(LocationService);

  selectedLocationType: string = 'country';

  editingIndex: number | null = null;
  originalLocation: Location | null = null;

  // data sources
  countriesDataSource = new MatTableDataSource<Country>([]);
  statesDataSource = new MatTableDataSource<State>([]);
  districtsDataSource = new MatTableDataSource<District>([]);
  taluksDataSource = new MatTableDataSource<Taluk>([]);

  displayedCountryColumns: string[] = ['id', 'code', 'name', "actions"];

  
  states = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'];

  country?: Country;
  state?: State;
  district?: District;
  taluk?: Taluk;

  readonly addDialog = inject(MatDialog);

  openEditDialog(name?: string, code?: string) {
    // Logic to open a dialog for adding a new location
    const currLocations: (Country | State | District | Taluk)[] = [];
    if (this.selectedLocationType == 'countries') {
      currLocations.push(...this.countriesDataSource.data);
    } else if (this.selectedLocationType == 'states') {
      currLocations.push(...this.statesDataSource.data);
    } else if (this.selectedLocationType == 'districts') {
      currLocations.push(...this.districtsDataSource.data);
    } else if (this.selectedLocationType == 'taluks') {
      currLocations.push(...this.taluksDataSource.data);
    }

    const dialogRef = this.addDialog.open(AddLocationDialogComponent, {
      width: '400px',
      data: {
        name: name,
        code: code,
        locations: currLocations
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog (e.g., add the new location)
        console.log('Dialog result:', result);
      }
    });
  }

  onLocationTypeChange(event: MatSelectChange) {
    this.selectedLocationType = event.value;
    console.log('Selected Location Type:', this.selectedLocationType);

    if (this.selectedLocationType == 'countries' 
      || this.selectedLocationType == 'states' 
      || this.selectedLocationType == 'districts'
      || this.selectedLocationType == 'taluks') {
      this.loadCountries();
    }
  }

  async loadCountries() {
    const data = await this.locationService.getCountries();
    // console.log('Countries loaded:', data);
    this.countriesDataSource.data = data;
  }

  addCountry(country: Country) {
    this.countriesDataSource.data.push(country);
    this.countriesDataSource._updateChangeSubscription();
  }

  async loadStates(countryId: number) {
    const data = await this.locationService.getStates(countryId);
    this.statesDataSource.data = data;
  }

  async loadDistricts(stateId: number) {
    const data = await this.locationService.getDistricts(stateId);
    this.districtsDataSource.data = data;
  }

  async loadTaluks(districtId: number) {
    // console.log('District ID:', districtId);
    const data = await this.locationService.getTaluks(districtId);
    // console.log('Taluks loaded:', data);
    this.taluksDataSource.data = data;
  }

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
