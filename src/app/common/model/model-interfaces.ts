import { Employee } from "./registration";
import { SectionSubject, Subject } from "./subject";

export interface SchoolClass {
  id?: number;
  name?: string;
  academicYear?: string;
  sections?: Section[];
}

export interface SectionId {
  schoolClassId: number;
  classTeacherId: number;
}

export interface Section {
  id?: SectionId;
  name: string;
  schoolClass: SchoolClass; // class name
  classTeacher: Employee; // employee number and should be teacher
  schoolClassId?: number;
  classTeacherId?: number;
  sectionSubjects?: SectionSubject[]
}
