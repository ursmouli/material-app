import { Student } from "./registration";

export interface Vehicle {
  id?: number;
  registrationNumber: string;
  capacity: number;
  driverName?: string;
  driverContact?: string;
  drivingLicense?: string;
  status?: string;
  make?: string;
  model?: string;
  year?: number;
}

export interface Route {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  distance?: number;
  vehicle: Vehicle,
  pointA?: string,
  pointB?: string,
  pointALatitude?: number,
  pointALongitude?: number,
  pointBLatitude?: number,
  pointBLongitude?: number,
}

export interface PickupPoint {
  id?: number;
  stopName: string;
  sequenceOrder: number;
  students?: Student[];
  route?: Route;
}
