import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SchoolClass } from "../model/model-interfaces";
import { PageResponse, Pagination } from "../model/pagination";



@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getAllClasses(pagination: Pagination): Promise<PageResponse<SchoolClass> | null> {
    try {
      console.log(pagination);
      const response = await firstValueFrom(this.http.post<PageResponse<SchoolClass>>(`${this.apiUrl}/classes/all`, pagination));
      console.log(response);
      return response ? response : null;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

  async saveClass(schoolClass: SchoolClass): Promise<SchoolClass> {
    return firstValueFrom(this.http.post<SchoolClass>(`${this.apiUrl}/classes/add`, schoolClass));
  }

}