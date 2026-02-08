import { Component, inject, OnInit } from '@angular/core';
import { DepartmentService } from '../common/services/department.service';
import { Department } from '../common/model/department';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit {

  departmentService = inject(DepartmentService);

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  searchTerm: string = '';
  searchDepartment = new Subject<string>()

  ngOnInit() {
    this.departmentService.getDepartments().then((departments) => {
      this.departments = departments;
    });

    this.searchDepartment.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchTerm = value;
      this.filterDepartments();
    });
    this.loadDepartments();
  }

  filterDepartments() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepartments = this.departments;
    } else {
      this.filteredDepartments = this.departments.filter((department) =>
        department.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  searchDepartments(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchDepartment.next(searchText);
  }

  addNewDepartment() {
    // TODO: Implement add new department functionality
    console.log('Add new department');
  }

  loadDepartments() {
    this.departmentService.getDepartments().then((departments) => {
      this.departments = departments;
      this.filteredDepartments = departments;
    });
  }
}
