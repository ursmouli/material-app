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

export interface VehicleRoute {
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
  pickupPoints?: PickupPoint[]
}

export interface PickupPoint {
  id?: number;
  stopName: string;
  sequenceOrder: number;
  students?: Student[];
  route?: VehicleRoute;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AssignedRoute {
  routeName: string;
  stopName: string;
  studentName: string;
  studentRollNumber: string;
  student: Student;
  route: VehicleRoute;
  pickupPoint: PickupPoint;
}