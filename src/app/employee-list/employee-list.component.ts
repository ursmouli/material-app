import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
}

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
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'position', 'department'];
  searchTerm: string = '';

  ngOnInit() {
    // Sample data - in a real app, this would come from a service
    this.employees = [
      { id: 1, name: 'John Doe', email: 'john.doe@company.com', position: 'Software Engineer', department: 'Engineering' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', position: 'Product Manager', department: 'Product' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@company.com', position: 'Designer', department: 'Design' },
      { id: 4, name: 'Alice Brown', email: 'alice.brown@company.com', position: 'Data Analyst', department: 'Analytics' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@company.com', position: 'DevOps Engineer', department: 'Engineering' }
    ];
    this.filteredEmployees = [...this.employees];
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredEmployees = [...this.employees];
    } else {
      this.filteredEmployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
