

import { inject, Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";
import { Student } from "../model/student";
import { firstValueFrom } from "rxjs";
import { Pagination } from "../model/pagination";
import { PageResponse } from "../model/pagination";

@Injectable({
    providedIn: 'root'
})
export class StudentService {
  http = inject(HttpClient);
  
  private apiUrl = environment.apiUrl;
  
  registerStudent(student: Student): Promise<Student> {
    return firstValueFrom(this.http.post<Student>(`${this.apiUrl}/students/add`, student));
  }

  getStudents(pagination: Pagination): Promise<PageResponse<Student>> {
    return firstValueFrom(this.http.post<PageResponse<Student>>(`${this.apiUrl}/students/all`, pagination));
  }
}
