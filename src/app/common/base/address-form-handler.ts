import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { State } from '../model/state';
import { District } from '../model/district';
import { Taluk } from '../model/taluk';
import { Country } from '../model/country';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AddressFormHandler {
  protected fb = inject(FormBuilder);
  protected locationService = inject(LocationService);

  // BehaviorSubjects for location data
  pIndianStates$ = new BehaviorSubject<State[]>([]);
  pStateDistricts$ = new BehaviorSubject<District[]>([]);
  pDistrictTaluks$ = new BehaviorSubject<Taluk[]>([]);

  rIndianStates$ = new BehaviorSubject<State[]>([]);
  rStateDistricts$ = new BehaviorSubject<District[]>([]);
  rDistrictTaluks$ = new BehaviorSubject<Taluk[]>([]);

  selectedCountry!: Country;

  /**
   * Creates a form group for address fields
   * @returns FormGroup with address fields and validators
   */
  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      houseNumber: [''],
      street: [''],
      landMark: [''],
      postalCode: [''],
      place: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      taluk: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      country: ['']
    });
  }

  /**
   * Sets up state change subscriptions for address forms
   * @param form The form group containing address fields
   * @param loadDistricts Function to load districts
   * @param loadTaluk Function to load taluks
   */
  setupAddressStateSubscriptions(
    form: FormGroup,
    loadDistricts: (stateId: number, isPermanent: boolean) => Promise<void>,
    loadTaluk: (districtId: number, isPermanent: boolean) => Promise<void>
  ): void {
    // Listen to state changes in permanent address
    form.get('permanentAddress.state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        loadDistricts(stateId, true);
      }
    });

    // Listen to district changes in permanent address
    form.get('permanentAddress.district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        loadTaluk(districtId, true);
      }
    });

    // Listen to state changes in residential address
    form.get('residentialAddress.state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        loadDistricts(stateId, false);
      }
    });

    // Listen to district changes in residential address
    form.get('residentialAddress.district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        loadTaluk(districtId, false);
      }
    });
  }

  /**
   * Sets up residential address same as permanent checkbox behavior
   * @param form The form group containing address fields
   */
  setupResidentialAddressSync(form: FormGroup): void {
    form.get('isResidentialSameAsPermanent')?.valueChanges.subscribe(value => {
      const resAddr = form.get('residentialAddress');

      if (value === 'yes') {
        resAddr?.clearValidators();
        resAddr?.reset();
        resAddr?.disable();
      } else {
        // Re-apply validation and enable
        resAddr?.setValidators([
          // Validators.required,
          // Validators.minLength(3)
        ]);
        resAddr?.enable();
      }
    });
  }

  /**
   * Resets and disables residential address
   * @param form The form group containing address fields
   */
  resetResidentialAddress(form: FormGroup): void {
    const resAddr = form.get('residentialAddress');
    if (resAddr) {
      resAddr.reset();
      resAddr.disable();
    }
  }

  /**
   * Loads districts for a given state
   * @param stateId The state ID to load districts for
   * @param isPermanent Whether this is for permanent or residential address
   */
  async loadDistricts(stateId: number, isPermanent: boolean): Promise<void> {
    try {
      const districts = await this.locationService.getDistricts(stateId);
      if (isPermanent) {
        this.pStateDistricts$.next(districts);
      } else {
        this.rStateDistricts$.next(districts);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
      if (isPermanent) {
        this.pStateDistricts$.next([]);
      } else {
        this.rStateDistricts$.next([]);
      }
    }
  }

  /**
   * Loads taluks for a given district
   * @param districtId The district ID to load taluks for
   * @param isPermanent Whether this is for permanent or residential address
   */
  async loadTaluk(districtId: number, isPermanent: boolean): Promise<void> {
    try {
      const taluks = await this.locationService.getTaluks(districtId);
      if (isPermanent) {
        this.pDistrictTaluks$.next(taluks);
      } else {
        this.rDistrictTaluks$.next(taluks);
      }
    } catch (error) {
      console.error('Error loading taluks:', error);
      if (isPermanent) {
        this.pDistrictTaluks$.next([]);
      } else {
        this.rDistrictTaluks$.next([]);
      }
    }
  }

  /**
   * Initializes address form with countries, states, and default values
   * @param form The form group containing address fields
   * @param defaultStateName Optional default state name (defaults to 'karnataka')
   */
  async initializeAddressForm(form: FormGroup, defaultStateName: string = 'karnataka'): Promise<void> {
    await this.loadCountriesAndSetDefault(form, defaultStateName);
  }

  /**
   * Loads countries and sets up India as default with states
   * @param form The form group containing address fields
   * @param defaultStateName The default state name to select
   */
  private async loadCountriesAndSetDefault(form: FormGroup, defaultStateName: string): Promise<void> {
    // console.log('Loading countries and setting default...');
    const countries = await this.locationService.getCountries();
    // console.log('Countries loaded:', countries);

    countries.forEach(country => {
      if (country.name.toLowerCase() === 'india') {
        this.selectedCountry = country;
        // console.log('Found India:', country);

        form.patchValue({
          permanentAddress: { country: this.selectedCountry?.id },
          residentialAddress: { country: this.selectedCountry?.id }
        });
        // console.log('Patched country values to form');

        this.setupDefaultStates(form, defaultStateName);
      }
    });
  }

  /**
   * Sets up states for India and selects default state
   * @param form The form group containing address fields
   * @param defaultStateName The default state name to select
   */
  private async setupDefaultStates(form: FormGroup, defaultStateName: string): Promise<void> {
    if (!this.selectedCountry) {
      // console.log('No selected country found');
      return;
    }

    // console.log('Setting up states for country:', this.selectedCountry.id);
    const states = await this.locationService.getStates(this.selectedCountry.id);
    // console.log('States loaded:', states);
    
    this.pIndianStates$.next(states);
    this.rIndianStates$.next(states);
    // console.log('Updated BehaviorSubjects with states');

    const defaultState = states.find(s => s.name.toLowerCase() === defaultStateName.toLowerCase());
    // console.log('Default state found:', defaultState);

    if (defaultState) {
      form.patchValue({
        permanentAddress: { state: defaultState.id },
        residentialAddress: { state: defaultState.id }
      });
      // console.log('Patched default state to form:', defaultState.id);
      this.loadDistricts(defaultState.id, true);
      this.loadDistricts(defaultState.id, false);
    }
  }
}
