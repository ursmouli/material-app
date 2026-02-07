import { Department } from "./department";

export interface Subject {
    id?: number;
    name: string;
    code: string;
    description: string;
    credits: number;
    department?: Department;
    edit?: boolean;
}