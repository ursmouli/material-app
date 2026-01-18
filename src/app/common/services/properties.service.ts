import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { firstValueFrom } from "rxjs";
import { Relation } from "../model/relations";

@Injectable({
    providedIn: 'root'
})
export class PropertiesService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async fetchRelationships() {
    try {
      const data = await firstValueFrom(this.http.get<string[]>(`${this.apiUrl}/properties/relationships`));
      // console.log('Fetched countries data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with relationships fetch operation:', error);
      return [];
    }
  }
}