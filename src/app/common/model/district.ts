export interface District extends Location {
  id: number;
  code: string;
  name: string;
  refId: number; // stateId
}