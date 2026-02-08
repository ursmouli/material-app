import { Component, inject, OnInit } from '@angular/core';
import { DepartmentService } from '../common/services/department.service';
import { Department } from '../common/model/department';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';

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

  departmentForm: FormGroup;
  isNewDepartment: boolean = false;
  editingRow: number | null = null;

  departmentService = inject(DepartmentService);

  departments: Department[] = [];
  departmentsDataSource = new MatTableDataSource<Department>([]);

  displayedColumns: string[] = ['name', 'code', 'description', 'actions'];
  searchTerm: string = '';
  searchDepartment = new Subject<string>();

  dialog = inject(MatDialog);

  constructor() {
    this.departmentForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

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
      this.departmentsDataSource.data = this.departments;
    } else {
      this.departmentsDataSource.data = this.departments.filter((department) =>
        department.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  searchDepartments(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchDepartment.next(searchText);
  }

  addNewDepartment() {
    this.isNewDepartment = true;
    this.editingRow = null;
    this.departmentForm.reset();

    const newDepartment: Partial<Department> = {
      id: undefined,
      name: '',
      code: '',
      description: ''
    };
    this.departmentsDataSource.data = [newDepartment as Department, ...this.departmentsDataSource.data];
    this.editingRow = 0;
  }

  submitDepartment(department: Department) {
    if (this.departmentForm.invalid) {
      return;
    }
    if (this.departmentForm.valid && department.id) {
      this.updateDepartment();
    } else {
      this.saveNewDepartment();
    }
  }

  saveNewDepartment() {
    if (this.departmentForm.valid) {
      console.log('Saving new department:', this.departmentForm.value);

      this.departmentService.addDepartment(this.departmentForm.value).then((department) => {
        console.log('Department saved:', department);

        this.departmentsDataSource.data[0] = department;
        this.departmentsDataSource._updateChangeSubscription();

        this.reset();
      });
    }
  }

  updateDepartment() {
    if (this.departmentForm.valid) {
      console.log('Updating department:', this.departmentForm.value);

      this.departmentService.updateDepartment(this.departmentForm.value).then((department) => {
        console.log('Department updated:', department);
        
        // Update the department in the data source
        const index = this.departmentsDataSource.data.findIndex(d => d.id === department.id);
        if (index !== -1) {
          this.departmentsDataSource.data[index] = department;
          this.departmentsDataSource._updateChangeSubscription();
        }
        this.reset();
      });
    }
  }

  reset() {
    this.departmentForm.reset();
    this.isNewDepartment = false;
    this.editingRow = null;
  }

  loadDepartments() {
    this.departmentService.getDepartments().then((departments) => {
      this.departments = departments;
      this.filterDepartments();
    });
  }

  isEditingRow(index: number): boolean {
    return this.editingRow === index;
  }
  
  editDepartment(index: number) {
    this.editingRow = index;
    const department = this.departmentsDataSource.data[index];
    console.log('Editing department: ', department);
    this.departmentForm.patchValue(department);
  }
  
  deleteDepartment(index: number, departmentId: number) {
    console.log('Deleting department: ', departmentId);
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.deleteDepartment(departmentId).then(() => {
          this.departmentsDataSource.data.splice(index, 1);
          this.departmentsDataSource._updateChangeSubscription();
        });
      }
    });
  }
  
  cancelEdit() {
    this.editingRow = null;
    this.loadDepartments();
  }
}

