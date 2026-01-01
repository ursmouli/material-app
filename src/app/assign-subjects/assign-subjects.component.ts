import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
}

interface Class {
  id: string;
  name: string;
  grade: string;
  academicYear: string;
  sections: any[];
  assignedSubjects?: Subject[];
}

@Component({
  selector: 'app-assign-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './assign-subjects.component.html',
  styleUrl: './assign-subjects.component.scss'
})
export class AssignSubjectsComponent implements OnInit {
  classes: Class[] = [];
  subjects: Subject[] = [];
  selectedClassId: string = '';
  selectedClass: Class | null = null;
  availableSubjects: Subject[] = [];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Sample classes data - in a real app, this would come from a service
    this.classes = [
      {
        id: 'CLS1',
        name: 'Grade 10 Science',
        grade: '10',
        academicYear: '2024-2025',
        sections: [],
        assignedSubjects: []
      },
      {
        id: 'CLS2',
        name: 'Grade 11 Mathematics',
        grade: '11',
        academicYear: '2024-2025',
        sections: [],
        assignedSubjects: []
      },
      {
        id: 'CLS3',
        name: 'Grade 9 General',
        grade: '9',
        academicYear: '2024-2025',
        sections: [],
        assignedSubjects: []
      }
    ];

    // Sample subjects data - in a real app, this would come from a service
    this.subjects = [
      {
        id: 1,
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Introduction to basic mathematical concepts',
        credits: 3,
        department: 'Mathematics'
      },
      {
        id: 2,
        name: 'Physics',
        code: 'PHYS101',
        description: 'Fundamental principles of physics',
        credits: 4,
        department: 'Physics'
      },
      {
        id: 3,
        name: 'Chemistry',
        code: 'CHEM101',
        description: 'Basic concepts of chemistry',
        credits: 3,
        department: 'Chemistry'
      },
      {
        id: 4,
        name: 'English Literature',
        code: 'ENGL101',
        description: 'Study of English literature',
        credits: 2,
        department: 'English'
      },
      {
        id: 5,
        name: 'Computer Science',
        code: 'CS101',
        description: 'Introduction to programming',
        credits: 3,
        department: 'Computer Science'
      },
      {
        id: 6,
        name: 'History',
        code: 'HIST101',
        description: 'World history and civilizations',
        credits: 2,
        department: 'History'
      },
      {
        id: 7,
        name: 'Geography',
        code: 'GEOG101',
        description: 'Physical and human geography',
        credits: 2,
        department: 'Geography'
      }
    ];
  }

  onClassChange() {
    this.selectedClass = this.classes.find(cls => cls.id === this.selectedClassId) || null;
    this.updateAvailableSubjects();
  }

  private updateAvailableSubjects() {
    if (!this.selectedClass) {
      this.availableSubjects = [];
      return;
    }

    const assignedSubjectIds = this.selectedClass.assignedSubjects?.map(s => s.id) || [];
    this.availableSubjects = this.subjects.filter(subject =>
      !assignedSubjectIds.includes(subject.id)
    );
  }

  assignSubject(subject: Subject) {
    if (!this.selectedClass) return;

    if (!this.selectedClass.assignedSubjects) {
      this.selectedClass.assignedSubjects = [];
    }

    this.selectedClass.assignedSubjects.push(subject);
    this.updateAvailableSubjects();

    this.snackBar.open(`Subject "${subject.name}" assigned to class successfully!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  removeSubject(subject: Subject) {
    if (!this.selectedClass || !this.selectedClass.assignedSubjects) return;

    const index = this.selectedClass.assignedSubjects.findIndex(s => s.id === subject.id);
    if (index > -1) {
      this.selectedClass.assignedSubjects.splice(index, 1);
      this.updateAvailableSubjects();

      this.snackBar.open(`Subject "${subject.name}" removed from class successfully!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  getAssignedSubjects(): Subject[] {
    return this.selectedClass?.assignedSubjects || [];
  }
}
