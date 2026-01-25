import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from '../common/services/employee.service';
import { Employee } from '../common/model/registration';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit {

  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);

  // Table variables
  employeeDataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = ['employeeNumber', 'firstName', 'lastName', 'role', 'actions'];

  // Form for new employee
  employeeForm: FormGroup;

  // Editing state
  editingRow: number | null = null;
  isNewEmployeeMode = false;

  // Sample data for demonstration
  departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];
  roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Administrator'];

  constructor() {
    this.employeeForm = this.fb.group({
      employeeNumber: [''],
      firstName: [''],
      lastName: [''],
      role: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  async loadEmployees() {
    try {
      const employees = await this.employeeService.getEmployees({
        page: 0,
        size: 50,
        sortField: 'firstName',
        sortDirection: 'ASC',
        searchTerm: ''
      });
      this.employeeDataSource.data = [...employees.content];
    } catch (error) {
      console.error('Error loading employees:', error);
      // Fallback sample data
      this.employeeDataSource.data = [
        {
          id: 1,
          employeeNumber: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Developer',
          gender: 'Male',
          dob: new Date('1990-01-15'),
          permanentAddress: {
            houseNumber: '123',
            street: 'Main St',
            landmark: 'Near Park',
            place: 'Anytown',
            stateId: '1',
            postalCode: '12345',
            countryId: '1',
            districtId: '1',
            talukId: '1',
            addressLine1: '123 Main St'
          },
          guardians: []
        },
        {
          id: 2,
          employeeNumber: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'Manager',
          gender: 'Female',
          dob: new Date('1985-05-20'),
          permanentAddress: {
            houseNumber: '456',
            street: 'Oak Ave',
            landmark: 'Near Mall',
            place: 'Somecity',
            stateId: '2',
            postalCode: '67890',
            countryId: '1',
            districtId: '2',
            talukId: '2',
            addressLine1: '456 Oak Ave'
          },
          guardians: []
        }
      ];
    }
  }

  startEdit(employee: Employee, index: number) {
    this.editingRow = index;
    this.isNewEmployeeMode = false;
    
    // Populate form with employee data
    this.employeeForm.patchValue({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role
    });
  }

  cancelEdit() {
    this.editingRow = null;
    this.isNewEmployeeMode = false;
    this.employeeForm.reset();
  }

  async saveEdit() {
    if (this.employeeForm.invalid) {
      return;
    }

    const index = this.editingRow;
    if (index !== null) {
      const updatedEmployee = {
        ...this.employeeDataSource.data[index],
        ...this.employeeForm.value
      };

      try {
        // Here you would call the update service method
        // await this.employeeService.updateEmployee(updatedEmployee);
        
        // For now, update locally
        this.employeeDataSource.data[index] = updatedEmployee;
        this.employeeDataSource.data = [...this.employeeDataSource.data];
        
        this.cancelEdit();
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    }
  }

  addNewEmployee() {
    this.isNewEmployeeMode = true;
    this.editingRow = null;
    this.employeeForm.reset();
    
    // Add a new empty row to the table
    const newEmployee: Partial<Employee> = {
      employeeNumber: '',
      firstName: '',
      lastName: '',
      role: '',
      gender: '',
      dob: new Date(),
      permanentAddress: {
        houseNumber: '',
        street: '',
        landmark: '',
        place: '',
        stateId: '',
        postalCode: '',
        countryId: '',
        districtId: '',
        talukId: '',
        addressLine1: ''
      },
      guardians: []
    };
    
    this.employeeDataSource.data = [newEmployee as Employee, ...this.employeeDataSource.data];
    this.editingRow = 0;
  }

  async saveNewEmployee() {
    if (this.employeeForm.invalid) {
      return;
    }

    const newEmployee: Employee = {
      id: Date.now(), // Temporary ID
      employeeNumber: this.employeeForm.value.employeeNumber || `EMP${Date.now()}`,
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      role: this.employeeForm.value.role,
      gender: '',
      dob: new Date(),
      permanentAddress: {
        houseNumber: '',
        street: '',
        landmark: '',
        place: '',
        stateId: '',
        postalCode: '',
        countryId: '',
        districtId: '',
        talukId: '',
        addressLine1: ''
      },
      guardians: []
    };

    try {
      // await this.employeeService.registerEmployee(newEmployee);
      
      // For now, add locally
      this.employeeDataSource.data[0] = newEmployee;
      this.employeeDataSource.data = [...this.employeeDataSource.data];
      
      this.cancelEdit();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  async deleteEmployee(index: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        // await this.employeeService.deleteEmployee(this.employeeDataSource.data[index].id);
        
        // For now, remove locally
        this.employeeDataSource.data.splice(index, 1);
        this.employeeDataSource.data = [...this.employeeDataSource.data];
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }

  isEditingRow(index: number): boolean {
    return this.editingRow === index;
  }
}
