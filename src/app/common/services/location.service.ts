import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { Country } from "../model/country";
import { State } from "../model/state";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { District } from "../model/district";
import { Taluk } from "../model/taluk";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getCountries(): Promise<Country[]> {
    try {
      const data = await firstValueFrom(this.http.get<Country[]>(`${this.apiUrl}/locations/countries`));
      // console.log('Fetched countries data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with countries the fetch operation:', error);
      return [];
    }
  }

  async getStates(countryId: number): Promise<State[]> {
    try {
      const data = await firstValueFrom(this.http.get<State[]>(`${this.apiUrl}/locations/countries/${countryId}/states`));
      // console.log('Fetched states data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with states the fetch operation:', error);
      return [];
    }
  }

  async getDistricts(stateId: number): Promise<District[]> {
    try {
      const data = await firstValueFrom(this.http.get<District[]>(`${this.apiUrl}/locations/states/${stateId}/districts`));
      // console.log('Fetched districts data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with districts the fetch operation:', error);
      return [];
    }
  }

  async getTaluks(districtId: number): Promise<Taluk[]> {
    try {
      const data = await firstValueFrom(this.http.get<Taluk[]>(`${this.apiUrl}/locations/districts/${districtId}/taluks`));
      // console.log('Fetched taluks data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with taluks the fetch operation:', error);
      return [];
    }
  }
}