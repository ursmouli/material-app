import { ResolveFn } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { VehicleService } from "../services/vehicle.service";
import { inject } from "@angular/core";
import { of } from "rxjs";
import { Vehicle } from "../model/transport-models";

export const vehicleResolver: ResolveFn<Vehicle | null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const id = route.params['id'];
  const vehicleService = inject(VehicleService);
  
  console.log(`route params: ${route.params}`);
  
  return id ? vehicleService.getVehicleById(id) : of(null);
}