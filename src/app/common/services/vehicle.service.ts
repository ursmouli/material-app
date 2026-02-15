import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { Vehicle } from "../model/transport-models";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getVehicles(): Promise<Vehicle[]> {
    return firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/vehicle/all`));
  }

  async addVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return firstValueFrom(this.http.post<Vehicle>(`${this.apiUrl}/vehicle/add`, vehicle));
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return firstValueFrom(this.http.get<Vehicle>(`${this.apiUrl}/vehicle/find/${id}`));
  }

  async updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return firstValueFrom(this.http.put<Vehicle>(`${this.apiUrl}/vehicle/update/${vehicle.id}`, vehicle));
  }

  async deleteVehicle(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/vehicle/delete/${id}`));
  }
}