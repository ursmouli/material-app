import { Department } from "./department";
import { Section, SectionId } from "./model-interfaces";

export interface Subject {
    id?: number;
    name: string;
    code: string;
    description: string;
    credits: number;
    department?: Department;
    edit?: boolean;
}

export interface SectionSubjectId {
    sectionId: SectionId;
    subjectId: number;
}

export interface SectionSubject {
    id?: SectionSubjectId;
    section?: Section;
    subject?: Subject;
}