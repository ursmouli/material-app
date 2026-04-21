import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { TimetableService } from '../common/services/timetable.service';
import { TimetableDayRow } from '../common/model/timetable';
import { SubjectService } from '../common/services/subject.service';
import { Subject } from '../common/model/subject';
import { MatSelectChange } from '@angular/material/select';
import { Section } from '../common/model/model-interfaces';
import { CommonModule } from '@angular/common';
import { SectionService } from '../common/services/section.service';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent {
  timetableService = inject(TimetableService);
  subjectService = inject(SubjectService);
  sectionService = inject(SectionService);

  periods = [...Array.from({ length: 8 }, (_, i) => `${i + 1}`)];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  displayedColumns: string[] = ['day', ...Array.from({ length: 8 }, (_, i) => `${i + 1}`)];

  // Sample data simulating your API response
  timetableData: TimetableDayRow[] = [];
  readonly totalPeriods = [1, 2, 3, 4, 5, 6, 7, 8];

  
  dataSource = new MatTableDataSource< TimetableDayRow>(); // Populate this from your API

  // Control panel properties
  selectedDay: string = '';
  selectedPeriod: string = '';
  subjectName: string = '';

  subjects: Subject[] = [];
  sections: Section[] = [];

  selectedSection: Section | null = null;

  ngOnInit() {

    this.sectionService.getAllSections().then(sections => {
      console.log('Sections:', sections);
      this.sections = sections;
    });

    this.subjectService.getSubjects().then(subjects => {
      console.log('Subjects:', subjects);
      this.subjects = subjects;
    });

    
  }

  onSectionChange(event: MatSelectChange): void {
    this.selectedSection = event.value;
    // Load timetable for the selected section
    console.log('Selected section:', this.selectedSection);
    this.loadTimetable();
  }

  loadTimetable(): void {
    // TODO: Implement loading timetable for selected section
    console.log('Loading timetable for section:', this.selectedSection);

    if (this.selectedSection) {
      this.timetableService.getTimetable(this.selectedSection.schoolClass.id!, this.selectedSection.classTeacher.id!).then(timetable => {
        console.log('Timetable:', timetable);
        this.dataSource.data = timetable;
      });
    }
  }

  // Control panel methods
  selectCell(day: string, period: string): void {
    this.selectedDay = day;
    this.selectedPeriod = period;
    this.subjectName = this.getCurrentSubject();
  }

  updateCell(): void {
    if (!this.selectedDay || !this.selectedPeriod) {
      alert('Please select both day and period');
      return;
    }

    const dayData = this.dataSource.data.find(item => item.dayOfWeek === this.selectedDay);
    if (dayData) {
      // dayData[this.selectedPeriod] = this.subjectName;
      this.dataSource.data = [...this.dataSource.data]; // Refresh the table
    }
  }

  clearCell(): void {
    if (!this.selectedDay || !this.selectedPeriod) {
      alert('Please select both day and period');
      return;
    }

    const dayData = this.dataSource.data.find(item => item.dayOfWeek === this.selectedDay);
    if (dayData) {
      // dayData[this.selectedPeriod] = '';
      this.subjectName = '';
      this.dataSource.data = [...this.dataSource.data]; // Refresh the table
    }
  }

  setSubject(subject: string): void {
    this.subjectName = subject;
  }

  getCurrentSubject(): string {
    if (!this.selectedDay || !this.selectedPeriod) {
      return '';
    }

    const dayData = this.dataSource.data.find(item => item.dayOfWeek === this.selectedDay);
    return dayData ? (dayData[this.selectedPeriod as keyof TimetableDayRow] as string) : '';
  }

  getPeriodDisplay(period: string): string {
    const periodMap: { [key: string]: string } = {
      'period1': 'Period 1 (8:00-8:45)',
      'period2': 'Period 2 (8:45-9:30)',
      'period3': 'Period 3 (9:30-10:15)',
      'period4': 'Period 4 (10:15-11:00)',
      'period5': 'Period 5 (11:00-11:45)',
      'period6': 'Period 6 (11:45-12:30)',
      'period7': 'Period 7 (12:30-1:15)',
      'period8': 'Period 8 (1:15-2:00)'
    };
    return periodMap[period] || period;
  }
}
