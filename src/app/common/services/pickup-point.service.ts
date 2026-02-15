import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { PickupPoint } from "../model/transport-models";

@Injectable({
  providedIn: 'root'
})
export class PickupPointService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getStops(): Promise<PickupPoint[]> {
    return firstValueFrom(this.http.get<PickupPoint[]>(`${this.apiUrl}/pickup-point/all`));
  }

  async getStopById(id: number): Promise<PickupPoint> {
    return firstValueFrom(this.http.get<PickupPoint>(`${this.apiUrl}/pickup-point/find/${id}`));
  }

  async addStop(stop: PickupPoint): Promise<PickupPoint> {
    return firstValueFrom(this.http.post<PickupPoint>(`${this.apiUrl}/pickup-point/add`, stop));
  }
}