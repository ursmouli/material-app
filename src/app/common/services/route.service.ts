import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { Route } from "../model/transport-models";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  async getRoutes(): Promise<Route[]> {
    return firstValueFrom(this.http.get<Route[]>(`${this.apiUrl}/route/all`));
  }

  async getRouteById(id: number): Promise<Route> {
    return firstValueFrom(this.http.get<Route>(`${this.apiUrl}/route/${id}`));
  }

  async addRoute(route: Route): Promise<Route> {
    return firstValueFrom(this.http.post<Route>(`${this.apiUrl}/route`, route));
  }
}