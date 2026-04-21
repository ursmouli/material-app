import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { firstValueFrom } from "rxjs";
import { TimetableDayRow, TimetableEntry } from "../model/timetable";

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  http = inject(HttpClient);
  
  private apiUrl = environment.apiUrl;

  getTimetable(schoolClassId: number, classTeacherId: number): Promise<TimetableDayRow[]> {
    return firstValueFrom(this.http.get<TimetableDayRow[]>(`${this.apiUrl}/timetable/bySection/${schoolClassId}/${classTeacherId}`));
  }

  addTimetable(timetable: any): Promise<TimetableEntry[]> {
    return firstValueFrom(this.http.post<TimetableEntry[]>(`${this.apiUrl}/timetable/add`, timetable));
  }

  updateTimetable(timetable: any): Promise<TimetableEntry[]> {
    return firstValueFrom(this.http.put<TimetableEntry[]>(`${this.apiUrl}/timetable/update`, timetable));
  }
}
