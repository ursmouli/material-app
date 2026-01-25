import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { State } from '../model/state';
import { District } from '../model/district';
import { Taluk } from '../model/taluk';
import { AddressFormHandler } from '../base/address-form-handler';
import { LocationService } from '../services/location.service';
import { Country } from '../model/country';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements OnInit {

  @Input({ required: true }) addressGroup!: FormGroup<any>;
  @Input() addressType!: 'permanent' | 'residential';
  @Input() title: string = 'Address';

  // Local BehaviorSubjects for template binding
  indianStates$ = new BehaviorSubject<State[]>([]);
  stateDistricts$ = new BehaviorSubject<District[]>([]);
  districtTaluks$ = new BehaviorSubject<Taluk[]>([]);

  locationService = inject(LocationService);

  selectedCountry!: Country;

  async ngOnInit() {
    // console.log('AddressFormComponent ngOnInit - addressType:', this.addressType);

    this.loadCountriesAndSetDefault(this.addressGroup, 'Karnataka');

    // Listen to state changes in residential address
    this.addressGroup.get('state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.loadDistricts(stateId);
      }
    });

    // Listen to district changes in permanent address
    this.addressGroup.get('district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.loadTaluk(districtId);
      }
    });
  }

  /**
   * Loads countries and sets up default state
   * @param form The form group to patch values to
   * @param defaultStateName The name of the default state to select
   */
  async loadCountriesAndSetDefault(form: FormGroup, defaultStateName: string): Promise<void> {
    // console.log('Loading countries and setting default...');
    const countries = await this.locationService.getCountries();
    // console.log('Countries loaded:', countries);

    countries.forEach(country => {
      if (country.name.toLowerCase() === 'india') {
        this.selectedCountry = country;
        // console.log('Found India:', country);

        form.patchValue({
          country: this.selectedCountry?.id,
        });
        // console.log('Patched country values to form');

        this.setupDefaultStates(form, defaultStateName);
      }
    });
  }

  /**
   * Sets up default states for the form
   * @param form The form group to patch values to
   * @param defaultStateName The name of the default state to select
   */
  async setupDefaultStates(form: FormGroup, defaultStateName: string): Promise<void> {
    if (!this.selectedCountry) {
      // console.log('No selected country found');
      return;
    }

    // console.log('Setting up states for country:', this.selectedCountry.id);
    const states = await this.locationService.getStates(this.selectedCountry.id);
    // console.log('States loaded:', states);

    this.indianStates$.next(states);
    // console.log('Updated BehaviorSubjects with states');

    const defaultState = states.find(s => s.name.toLowerCase() === defaultStateName.toLowerCase());
    // console.log('Default state found:', defaultState);

    if (defaultState) {
      form.patchValue({
        state: defaultState.id
      });
      // console.log('Patched default state to form:', defaultState.id);
      this.loadDistricts(defaultState.id);
    }
  }

  /**
   * Loads districts for a given state
   * @param stateId The state ID to load districts for
   */
  async loadDistricts(stateId: number): Promise<void> {
    try {
      const districts = await this.locationService.getDistricts(stateId);
      this.stateDistricts$.next(districts);
    } catch (error) {
      console.error('Error loading districts:', error);
      this.stateDistricts$.next([]);
    }
  }

  /**
   * Loads taluks for a given district
   * @param districtId The district ID to load taluks for
   */
  async loadTaluk(districtId: number) {
    try {
      const taluks = await this.locationService.getTaluks(districtId);
      this.districtTaluks$.next(taluks);
    } catch (error) {
      console.error('Error loading taluks:', error);
      this.districtTaluks$.next([]);
    }
  }
}
