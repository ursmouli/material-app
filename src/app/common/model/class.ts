import { Section } from "./section";

export interface Class {
  id: string;
  name: string;
  grade: string;
  academicYear: string;
  sections: Section[];
}
