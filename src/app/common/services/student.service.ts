

import { inject, Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";
import { Student } from "../model/student";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StudentService {
  http = inject(HttpClient);
  
  private apiUrl = environment.apiUrl;
  
  registerStudent(student: Student): Promise<Student> {
    return firstValueFrom(this.http.post<Student>(`${this.apiUrl}/students/add`, student));
  }
}
