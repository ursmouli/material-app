export interface Taluk extends Location {
  id: number;
  code?: string;
  name: string;
  refId: number; // districtId
}