import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  displayedColumns: string[] = ['id', 'name', 'code', 'description', 'credits', 'department'];
  searchTerm: string = '';
  showAddDialog: boolean = false;

  newSubject: Partial<Subject> = {
    name: '',
    code: '',
    description: '',
    credits: 1,
    department: ''
  };

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Sample data - in a real app, this would come from a service
    this.subjects = [
      {
        id: 1,
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Introduction to basic mathematical concepts including algebra, geometry, and calculus',
        credits: 3,
        department: 'Mathematics'
      },
      {
        id: 2,
        name: 'Physics',
        code: 'PHYS101',
        description: 'Fundamental principles of physics including mechanics, thermodynamics, and electromagnetism',
        credits: 4,
        department: 'Physics'
      },
      {
        id: 3,
        name: 'Chemistry',
        code: 'CHEM101',
        description: 'Basic concepts of chemistry including atomic structure, chemical bonding, and reactions',
        credits: 3,
        department: 'Chemistry'
      },
      {
        id: 4,
        name: 'English Literature',
        code: 'ENGL101',
        description: 'Study of classic and contemporary English literature with focus on critical analysis',
        credits: 2,
        department: 'English'
      },
      {
        id: 5,
        name: 'Computer Science',
        code: 'CS101',
        description: 'Introduction to programming, algorithms, and computer systems',
        credits: 3,
        department: 'Computer Science'
      }
    ];
    this.filteredSubjects = [...this.subjects];
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.department.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openAddDialog() {
    this.showAddDialog = true;
    this.newSubject = {
      name: '',
      code: '',
      description: '',
      credits: 1,
      department: ''
    };
  }

  closeAddDialog() {
    this.showAddDialog = false;
  }

  addSubject() {
    if (this.newSubject.name && this.newSubject.code && this.newSubject.description && this.newSubject.department) {
      const subject: Subject = {
        id: this.subjects.length + 1,
        name: this.newSubject.name,
        code: this.newSubject.code,
        description: this.newSubject.description,
        credits: this.newSubject.credits || 1,
        department: this.newSubject.department
      };

      this.subjects.push(subject);
      this.filteredSubjects = [...this.subjects];

      this.snackBar.open('Subject added successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      this.closeAddDialog();
    } else {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
