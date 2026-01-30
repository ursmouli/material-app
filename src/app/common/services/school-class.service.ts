import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SchoolClass } from "../model/model-interfaces";



@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getAllClasses(): Promise<SchoolClass[]> {
    try {
      const response = await firstValueFrom(this.http.get<SchoolClass[]>(`${this.apiUrl}/classes`));
      // console.log(response);
      return response ? response : [];
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  }

  saveClass(schoolClass: SchoolClass): Promise<SchoolClass> {
    return firstValueFrom(this.http.post<SchoolClass>(`${this.apiUrl}/classes`, schoolClass));
  }

}