

import { Injectable, inject } from "@angular/core";
import { Employee } from "../model/registration";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { PageResponse, Pagination } from "../model/pagination";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    http = inject(HttpClient);

    private apiUrl = environment.apiUrl;

    registerEmployee(employee: Employee): Promise<Employee> {
        return firstValueFrom(this.http.post<Employee>(`${this.apiUrl}/employees/add`, employee));
    }

    getEmployees(pagination: Pagination): Promise<PageResponse<Employee>> {
        return firstValueFrom(this.http.post<PageResponse<Employee>>(`${this.apiUrl}/employees/all`, pagination));
    }

    updateEmployeeDepartment(employee: Employee): Promise<Employee> {
        return firstValueFrom(this.http.post<Employee>(`${this.apiUrl}/employees/add/department`, employee));
    }

}