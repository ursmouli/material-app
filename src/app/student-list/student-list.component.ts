import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../common/services/student.service';
import { Student } from '../common/model/registration';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageResponse } from '../common/model/pagination';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';

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
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {

  studentService = inject(StudentService);

  // table variables
  studentsDataSource = new MatTableDataSource<Student>([]);
  displayedColumns: string[] = ['name', 'registrationNumber', 'actions'];

  // pagination variables
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  sortField = 'firstName';
  sortDirection = 'ASC';

  searchSubject = new Subject<string>();
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dialog = inject(MatDialog);
  

  constructor() {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value : string | undefined) => {
      // console.log(value);
      this.searchTerm = value || '';
      this.pageIndex = 0;
      this.loadData();
    });

    this.loadData();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  loadData() {
    // console.log(`Search term: ${this.searchTerm}`);
    this.studentService.getStudents({
      page: this.pageIndex, 
      size: this.pageSize, 
      sortField: this.sortField, 
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm
    }).then((students: PageResponse<Student>) => {
      this.studentsDataSource.data = [...students.content];
      this.totalElements = students.totalElements;
    });
  }

  editStudent(student: Student) {
    
  }

  deleteStudent(student: Student) {
    
  }

  viewStudent(student: Student) {
    // open dialog to view all student details
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      data: { student },
      width: '600px',
      height: 'auto',
      maxWidth: '90vw'
    });
  }

  onAddStudent() {
    
  }
}
