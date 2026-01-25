import { Address } from "./address";

export interface Registration {
  id?: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  dob: Date;
  bloodGroup?: string;
  permanentAddress: Address;
  residentialAddress?: Address;
  sameAsPermanentAddress?: boolean;
  guardians: Guardian[];
  siblings?: Sibling[];
  registrationDate?: Date;
  registrationNumber?: string;
}

export interface Student extends Registration {
  rollNumber?: string;
}

export interface Employee extends Registration {
  employeeNumber?: string;
  maritalStatus?: string;
  previousEmployment?: string;
  role?: string;
  department?: string;
}

export interface Guardian {
  relation: string;
  name: string;
  phone: string;
  email: string;
}

export interface Sibling {
  relation: string;
  name: string;
  dob: Date;
  institutionName: string;
  institutionPlace: string;
}