import { Employee } from "./registration";

export interface SchoolClass {
  id?: number;
  name?: string;
  academicYear?: string;
  sections?: Section[];
}


export interface Section {
  id?: number;
  name: string;
  schoolClass: SchoolClass; // class name
  classTeacher: Employee; // employee number and should be teacher
  schoolClassId?: number;
  classTeacherId?: number;
}
