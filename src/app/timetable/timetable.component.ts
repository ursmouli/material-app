import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
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
  displayedColumns = ['day', 'period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7', 'period8'];

  timeSlots = [
    '8:00 AM - 8:45 AM',
    '8:45 AM - 9:30 AM',
    '9:30 AM - 10:15 AM',
    '10:15 AM - 11:00 AM',
    '11:00 AM - 11:45 AM',
    '11:45 AM - 12:30 PM',
    '12:30 PM - 1:15 PM',
    '1:15 PM - 2:00 PM',
  ];

  periodHeaders = [
    'Period 1<br>8:00-8:45',
    'Period 2<br>8:45-9:30',
    'Period 3<br>9:30-10:15',
    'Period 4<br>10:15-11:00',
    'Period 5<br>11:00-11:45',
    'Period 6<br>11:45-12:30',
    'Period 7<br>12:30-1:15',
    'Period 8<br>1:15-2:00'
  ];

  dataSource = new MatTableDataSource<any>();

  // Control panel properties
  selectedDay: string = '';
  selectedPeriod: string = '';
  subjectName: string = '';

  ngOnInit() {
    this.dataSource.data = [
      { day: 'Monday', period1: 'Mathematics', period2: 'Physics', period3: 'Chemistry', period4: 'English', period5: 'History', period6: 'Geography', period7: 'Biology', period8: 'Computer Science' },
      { day: 'Tuesday', period1: 'Physics', period2: 'Mathematics', period3: 'English', period4: 'Chemistry', period5: 'Biology', period6: 'History', period7: 'Computer Science', period8: 'Geography' },
      { day: 'Wednesday', period1: 'Chemistry', period2: 'English', period3: 'Mathematics', period4: 'Physics', period5: 'Computer Science', period6: 'Biology', period7: 'History', period8: 'Geography' },
      { day: 'Thursday', period1: 'English', period2: 'Chemistry', period3: 'Physics', period4: 'Mathematics', period5: 'History', period6: 'Computer Science', period7: 'Geography', period8: 'Biology' },
      { day: 'Friday', period1: 'Mathematics', period2: 'History', period3: 'Geography', period4: 'English', period5: 'Physics', period6: 'Chemistry', period7: 'Biology', period8: 'Computer Science' },
      { day: 'Saturday', period1: 'Computer Science', period2: 'Biology', period3: 'History', period4: 'Geography', period5: 'Mathematics', period6: 'Physics', period7: 'English', period8: 'Chemistry' },
      { day: 'Sunday', period1: '', period2: '', period3: '', period4: '', period5: '', period6: '', period7: '', period8: '' }
    ];
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

    const dayData = this.dataSource.data.find(item => item.day === this.selectedDay);
    if (dayData) {
      dayData[this.selectedPeriod] = this.subjectName;
      this.dataSource.data = [...this.dataSource.data]; // Refresh the table
    }
  }

  clearCell(): void {
    if (!this.selectedDay || !this.selectedPeriod) {
      alert('Please select both day and period');
      return;
    }

    const dayData = this.dataSource.data.find(item => item.day === this.selectedDay);
    if (dayData) {
      dayData[this.selectedPeriod] = '';
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

    const dayData = this.dataSource.data.find(item => item.day === this.selectedDay);
    return dayData ? dayData[this.selectedPeriod] : '';
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
