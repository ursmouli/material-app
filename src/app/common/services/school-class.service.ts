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

  async getAllClasses(pagination: Pagination): Promise<PageResponse<SchoolClass>> {
    return firstValueFrom(this.http.post<PageResponse<SchoolClass>>(`${this.apiUrl}/classes/all`, pagination));
  }

  async saveClass(schoolClass: SchoolClass): Promise<SchoolClass> {
    return firstValueFrom(this.http.post<SchoolClass>(`${this.apiUrl}/classes/add`, schoolClass));
  }

}