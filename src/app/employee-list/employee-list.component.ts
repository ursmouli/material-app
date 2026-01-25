import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../common/services/employee.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PageResponse } from '../common/model/pagination';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { Employee } from '../common/model/registration';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {

  employeeService = inject(EmployeeService);

  // table variables
  employeeDataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = ['id', 'name', 'email', 'position', 'department'];

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

  ngOnInit() {
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
  
  onSearchClear() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  async loadData() {
    // console.log(`Search term: ${this.searchTerm}`);
    this.employeeService.getEmployees({
      page: this.pageIndex, 
      size: this.pageSize, 
      sortField: this.sortField, 
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm
    }).then((employees: PageResponse<Employee>) => {
      this.employeeDataSource.data = [...employees.content];
      this.totalElements = employees.totalElements;
    });
  }

  viewStudent(employee: Employee) {
    // open dialog to view all employee details
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: { employee },
      width: '600px',
      height: 'auto',
      maxWidth: '90vw'
    });
  }
}
