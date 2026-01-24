import { Component, inject, ViewChild } from '@angular/core';
import { StudentService } from '../common/services/student.service';
import { Student } from '../common/model/student';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageResponse } from '../common/model/pagination';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {

  studentService = inject(StudentService);

  // students$ = this.studentService.getStudents();

  students: Student[] = [];

  // table variables
  studentsDataSource = new MatTableDataSource<Student>([]);
  displayedColumns: string[] = ['name', 'registrationNumber', 'actions'];

  // pagination variables
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  sortField = 'firstName';
  sortDirection = 'ASC';

  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor() {
    this.studentService.getStudents({
      page: this.pageIndex, 
      size: this.pageSize, 
      sortField: this.sortField, 
      sortDirection: this.sortDirection
    }).then((students: PageResponse<Student>) => {
      console.log(students);
      this.studentsDataSource.data = students.content;
      this.paginator.length = students.totalElements;
      this.totalElements = students.totalElements;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSearch();
  }

  onSearch() {
    this.studentService.getStudents({
      page: this.pageIndex, 
      size: this.pageSize, 
      sortField: this.sortField, 
      sortDirection: this.sortDirection
    }).then((students: PageResponse<Student>) => {
      this.studentsDataSource.data = students.content;
      this.paginator.length = students.totalElements;
      this.totalElements = students.totalElements;
    });
  }

  editStudent(student: Student) {
    
  }

  deleteStudent(student: Student) {
    
  }

  viewStudent(student: Student) {
    
  }
}
