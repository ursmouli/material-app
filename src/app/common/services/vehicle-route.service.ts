import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { VehicleRoute } from "../model/transport-models";

@Injectable({
  providedIn: 'root'
})
export class VehicleRouteService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getRoutes(): Promise<VehicleRoute[]> {
    return firstValueFrom(this.http.get<VehicleRoute[]>(`${this.apiUrl}/route/all`));
  }

  async getRouteById(id: number): Promise<VehicleRoute> {
    return firstValueFrom(this.http.get<VehicleRoute>(`${this.apiUrl}/route/find/${id}`));
  }

  async addRoute(route: VehicleRoute): Promise<VehicleRoute> {
    return firstValueFrom(this.http.post<VehicleRoute>(`${this.apiUrl}/route/add`, route));
  }

  async updateRoute(id: number, route: VehicleRoute): Promise<VehicleRoute> {
    return firstValueFrom(this.http.put<VehicleRoute>(`${this.apiUrl}/route/update/${id}`, route));
  }
  
  async assignStudentRoute(studentId: number, stopId: number): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.apiUrl}/route/assign-student-route/${studentId}/${stopId}`, {}));
  }

  async getPickupPointStudents(routeId: number): Promise<VehicleRoute> {
    return firstValueFrom(this.http.get<VehicleRoute>(`${this.apiUrl}/route/pickup-point-students/${routeId}`));
  }
}