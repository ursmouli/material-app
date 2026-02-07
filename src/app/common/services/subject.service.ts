import { Injectable, inject } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from "rxjs";
import { Subject } from "../model/subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  http = inject(HttpClient);

  private apiUrl = environment.apiUrl;
  
  getSubjects(): Promise<Subject[]> {
    return firstValueFrom(this.http.get<Subject[]>(`${this.apiUrl}/subjects/all`));
  }

  addSubject(subject: Subject): Promise<Subject> {
    return firstValueFrom(this.http.post<Subject>(`${this.apiUrl}/subjects`, subject));
  }
}
