import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Teacher } from '../common/model/teacher';
import { Class } from '../common/model/class';
import { SchoolClassService } from '../common/services/school-class.service';
import { EmployeeService } from '../common/services/employee.service';
import { Employee } from '../common/model/registration';
import { MatTabsModule } from '@angular/material/tabs';
import { SchoolClass } from '../common/model/model-interfaces';
import { MatTableDataSource, MatHeaderCell, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-new-class',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatHeaderCell,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonToggleModule
  ],
  templateUrl: './new-class.component.html',
  styleUrl: './new-class.component.scss'
})
export class NewClassComponent implements OnInit {
  classForm: FormGroup;
  sectionForm: FormGroup;
  availableTeachers: Employee[] = [];
  classes: SchoolClass[] = [];

  // Pagination variables
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  sortField = 'name';
  sortDirection = 'ASC';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'academicYear', 'actions'];
  classesDataSource = new MatTableDataSource<SchoolClass>([]);

  schoolClassService = inject(SchoolClassService);
  employeeService = inject(EmployeeService);

  // Editing state
  editingRow: number | null = null;
  isNewClassMode = false;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      academicYear: ['', [Validators.required]],
    });
    this.sectionForm = this.fb.group({
      name: ['', [Validators.required]],
      teacherId: ['', [Validators.required]],
      capacity: [30, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  ngOnInit() {
    this.loadClasses();

    this.employeeService.getTeachers().then((employees: Employee[]) => {
      this.availableTeachers = employees;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClasses();
  }

  isEditingRow(index: number): boolean {
    return this.editingRow === index;
  }

  startEdit(row: SchoolClass, index: number) {
    this.editingRow = index;
    this.classForm.patchValue(row);
  }

  saveEdit() {
    this.editingRow = null;
    this.classForm.reset();
  }

  deleteClass(index: number) {
    this.classes.splice(index, 1);
    this.classesDataSource.data = this.classes;
  }

  loadClasses() {
    this.schoolClassService.getAllClasses().then((classes: SchoolClass[]) => {
      console.log(`Loaded classes ${JSON.stringify(classes)}`);
      this.classes = classes;

      this.classesDataSource.data = this.classes;
      this.paginator.firstPage();
    });
  }

  cancelEdit(): void {
    this.isNewClassMode = false;
    this.editingRow = null;
    this.classForm.reset();
  }

  addNewClass() {
    this.isNewClassMode = true;
    this.editingRow = null;
    this.classForm.reset();

    const newClass: Partial<SchoolClass> = {
      name: '',
      academicYear: '',
    };

    this.classesDataSource.data = [newClass as SchoolClass, ...this.classesDataSource.data];
    this.editingRow = 0;
  }

  async saveNewClass() {
    if (this.classForm.invalid) {
      return;
    }

    const schoolClass: SchoolClass = {
      name: this.classForm.value.name,
      academicYear: this.classForm.value.academicYear,
    };

    try {
      const savedClass = await this.schoolClassService.saveClass(schoolClass);
      console.log(savedClass);

      
      this.classesDataSource.data[0] = savedClass;
      this.classesDataSource.data = [...this.classesDataSource.data];

      this.snackBar.open('Class created successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      this.cancelEdit();
    } catch (error) {
      console.error('Error saving class:', error);
    }

    this.isNewClassMode = false;
  }

  async saveClass(): Promise<SchoolClass> {
    if (this.classForm.invalid) {
      return Promise.resolve({} as SchoolClass);
    }

    const schoolClass: SchoolClass = {
      name: this.classForm.value.name,
      academicYear: this.classForm.value.academicYear,
    };

    try {
      const savedClass = await this.schoolClassService.saveClass(schoolClass);
      console.log(savedClass);
      this.snackBar.open('Class created successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.cancelEdit();
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error saving class', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return Promise.resolve({} as SchoolClass);
    }
    return Promise.resolve(schoolClass);
  }
}
