import { Injectable, inject } from "@angular/core";

import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from "rxjs";
import { Department } from "../model/department";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  http = inject(HttpClient);

  private apiUrl = environment.apiUrl;
  
  getDepartments(): Promise<Department[]> {
    return firstValueFrom(this.http.get<Department[]>(`${this.apiUrl}/departments/all`));
  }

  addDepartment(department: Department): Promise<Department> {
    return firstValueFrom(this.http.post<Department>(`${this.apiUrl}/departments`, department));
  }
}