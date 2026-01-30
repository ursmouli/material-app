import { Employee } from "./registration";

export interface SchoolClass {
  id?: number;
  name: string;
  academicYear?: string;
  sections?: Section[];
}


export interface Section {
  id?: number;
  name: string;
  schoolClass: SchoolClass;
  classTeacher: Employee; // with role = Teacher
}
