import { SectionId } from "./model-interfaces";

export interface TimetableEntry {
  sectionId: SectionId;
  sectionName: string;
  dayOfWeek: string;
  periodNumber: number;
  subjectName: string;
  teacherName: string;
}

export interface PeriodDetails {
  subjectName: string;
  teacherName: string;
  classroom: string;
}

export interface TimetableDayRow {
  dayOfWeek: string;
  sectionName: string;
  periods: { [key: number]: PeriodDetails }; // This matches the Java Map
}