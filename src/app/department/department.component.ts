import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from '../common/services/employee.service';
import { Employee } from '../common/model/registration';
import { debounceTime, distinctUntilChanged, Subject, startWith, map, Observable } from 'rxjs';

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
    MatPaginatorModule,
    MatAutocompleteModule,
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
  displayedColumns: string[] = ['department', 'employee', 'role', 'actions'];

  // Pagination variables
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  sortField = 'firstName';
  sortDirection = 'ASC';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Form for new employee
  employeeForm: FormGroup;

  // Editing state
  editingRow: number | null = null;
  isNewEmployeeMode = false;

  // Sample data for demonstration
  departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];
  roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Administrator'];
  availableEmployees: Employee[] = [];

  // Search and filter variables
  searchSubject = new Subject<string>();
  searchTerm: string = '';
  selectedDepartment: string = '';
  selectedRole: string = '';
  filteredEmployees: Observable<Employee[]>;

  constructor() {
    this.employeeForm = this.fb.group({
      selectedEmployee: [''],
      department: [''],
      role: ['']
    });

    // Setup autocomplete filtering
    this.filteredEmployees = this.employeeForm.get('selectedEmployee')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value || ''))
    );
  }

  ngOnInit() {
    this.setupSearch();
    this.loadEmployees();
  }

  async loadEmployees() {
    try {
      const employees = await this.employeeService.getEmployees({
        page: this.pageIndex,
        size: this.pageSize,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
        searchTerm: this.buildSearchTerm()
      });
      this.employeeDataSource.data = [...employees.content];
      this.availableEmployees = [...employees.content];
      this.totalElements = employees.totalElements;
    } catch (error) {
      console.error('Error loading employees:', error);
      // Fallback sample data
      const sampleEmployees = [
        {
          id: 1,
          employeeNumber: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
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
          department: 'HR',
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
        },
        {
          id: 3,
          employeeNumber: 'EMP003',
          firstName: 'Mike',
          lastName: 'Johnson',
          department: 'Finance',
          role: 'Designer',
          gender: 'Male',
          dob: new Date('1992-03-10'),
          permanentAddress: {
            houseNumber: '789',
            street: 'Pine St',
            landmark: 'Near Library',
            place: 'Otherville',
            stateId: '3',
            postalCode: '54321',
            countryId: '1',
            districtId: '3',
            talukId: '3',
            addressLine1: '789 Pine St'
          },
          guardians: []
        }
      ];
      this.employeeDataSource.data = this.filterEmployees(sampleEmployees);
      this.availableEmployees = sampleEmployees;
      this.totalElements = this.filterEmployees(sampleEmployees).length;
    }
  }

  startEdit(employee: Employee, index: number) {
    this.editingRow = index;
    this.isNewEmployeeMode = false;
    
    // Populate form with employee data
    this.employeeForm.patchValue({
      selectedEmployee: employee,
      department: employee.department || '',
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
      department: '',
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

    const selectedEmployee = this.employeeForm.value.selectedEmployee;
    const newEmployee: Employee = {
      id: Date.now(), // Temporary ID
      employeeNumber: selectedEmployee?.employeeNumber || `EMP${Date.now()}`,
      firstName: selectedEmployee?.firstName || '',
      lastName: selectedEmployee?.lastName || '',
      department: this.employeeForm.value.department || selectedEmployee?.department || '',
      role: this.employeeForm.value.role || selectedEmployee?.role || '',
      gender: selectedEmployee?.gender || '',
      dob: selectedEmployee?.dob || new Date(),
      permanentAddress: selectedEmployee?.permanentAddress || {
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
      guardians: selectedEmployee?.guardians || []
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

  onEmployeeSelectionChange(event: any) {
    const selectedEmployee = event.option?.value;
    if (selectedEmployee) {
      this.employeeForm.patchValue({
        department: selectedEmployee.department || '',
        role: selectedEmployee.role
      });
    }
  }

  displayEmployeeFn(employee: Employee): string {
    return employee ? `${employee.firstName} ${employee.lastName} (${employee.employeeNumber})` : '';
  }

  private _filterEmployees(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.availableEmployees.filter(employee => 
      employee.firstName.toLowerCase().includes(filterValue) ||
      employee.lastName.toLowerCase().includes(filterValue) ||
      employee.employeeNumber?.toLowerCase().includes(filterValue)
    );
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value: string | undefined) => {
      this.searchTerm = value || '';
      this.pageIndex = 0;
      this.loadEmployees();
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onDepartmentFilter(department: string) {
    this.selectedDepartment = department;
    this.pageIndex = 0;
    this.loadEmployees();
  }

  onRoleFilter(role: string) {
    this.selectedRole = role;
    this.pageIndex = 0;
    this.loadEmployees();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedRole = '';
    this.pageIndex = 0;
    this.loadEmployees();
  }

  buildSearchTerm(): string {
    const searchParts = [];
    if (this.searchTerm) {
      searchParts.push(this.searchTerm);
    }
    if (this.selectedDepartment) {
      searchParts.push(`department:${this.selectedDepartment}`);
    }
    if (this.selectedRole) {
      searchParts.push(`role:${this.selectedRole}`);
    }
    return searchParts.join(' ');
  }

  filterEmployees(employees: Employee[]): Employee[] {
    return employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.employeeNumber?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || 
        employee.department === this.selectedDepartment;
      
      const matchesRole = !this.selectedRole || 
        employee.role === this.selectedRole;
      
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }
}
