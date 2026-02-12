
import { inject, Injectable } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SchoolClass, Section } from "../model/model-interfaces";
import { PageResponse, Pagination } from "../model/pagination";



@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getAllSections(): Promise<Section[]> {
    return firstValueFrom(this.http.get<Section[]>(`${this.apiUrl}/sections/all`));
  }

  async getSections(pagination: Pagination): Promise<PageResponse<Section>> {
    return firstValueFrom(this.http.post<PageResponse<Section>>(`${this.apiUrl}/sections/all`, pagination));
  }

  async deleteSection(section: Section): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/sections/delete/${section.schoolClass.id}/${section.classTeacher.id}`));
  }

  async saveSection(section: Section): Promise<Section> {
    return firstValueFrom(this.http.post<Section>(`${this.apiUrl}/sections/add`, section));
  }

  async updateSection(section: Section): Promise<Section> {
    return firstValueFrom(this.http.post<Section>(`${this.apiUrl}/sections/update`, section));
  }
}