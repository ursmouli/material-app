import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SchoolClass, Section } from "../model/model-interfaces";
import { PageResponse, Pagination } from "../model/pagination";



@Injectable({
  providedIn: 'root'
})
export class SchoolClassSectionService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getSections(pagination: Pagination): Promise<PageResponse<Section>> {
    return firstValueFrom(this.http.post<PageResponse<Section>>(`${this.apiUrl}/sections/all`, pagination));
  }

  async saveSection(section: Section): Promise<Section> {
    return firstValueFrom(this.http.post<Section>(`${this.apiUrl}/sections/add`, section));
  }

  async updateSection(section: Section): Promise<Section> {
    return firstValueFrom(this.http.post<Section>(`${this.apiUrl}/sections/update`, section));
  }

  async getClasses(): Promise<SchoolClass[]> {
    return firstValueFrom(this.http.get<SchoolClass[]>(`${this.apiUrl}/classes/all`));
  }

  async getAllClasses(pagination: Pagination): Promise<PageResponse<SchoolClass>> {
    return firstValueFrom(this.http.post<PageResponse<SchoolClass>>(`${this.apiUrl}/classes/all`, pagination));
  }

  async saveClass(schoolClass: SchoolClass): Promise<SchoolClass> {
    return firstValueFrom(this.http.post<SchoolClass>(`${this.apiUrl}/classes/add`, schoolClass));
  }

}