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
    return firstValueFrom(this.http.post<Department>(`${this.apiUrl}/departments/add`, department));
  }

  updateDepartment(department: Department): Promise<Department> {
    return firstValueFrom(this.http.put<Department>(`${this.apiUrl}/departments/update`, department));
  }

  deleteDepartment(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/departments/delete/${id}`));
  }
}
