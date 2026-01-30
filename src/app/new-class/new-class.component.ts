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
import { MatTableDataSource, MatRecycleRows, MatHeaderCell, MatTableModule } from '@angular/material/table';
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
    MatRecycleRows,
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


    // Sample teachers data - in a real app, this would come from a service
    // this.availableTeachers = [
    //   { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@school.com', subject: 'Mathematics' },
    //   { id: 2, name: 'Mr. Michael Chen', email: 'michael.chen@school.com', subject: 'Science' },
    //   { id: 3, name: 'Ms. Emily Davis', email: 'emily.davis@school.com', subject: 'English' },
    //   { id: 4, name: 'Mr. David Wilson', email: 'david.wilson@school.com', subject: 'History' },
    //   { id: 5, name: 'Mrs. Lisa Brown', email: 'lisa.brown@school.com', subject: 'Geography' }
    // ];

    this.employeeService.getTeachers().then((employees: Employee[]) => {
      this.availableTeachers = employees;
    });



    // Add one section by default
    // this.addSection();
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

  cancelEdit() {
    this.editingRow = null;
    this.classForm.reset();
  }

  saveEdit() {
    this.editingRow = null;
    this.classForm.reset();
  }

  deleteClass(index: number) {
    this.classes.splice(index, 1);
    this.classesDataSource.data = this.classes;
  }

  saveNewClass() {
    this.isNewClassMode = false;
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

  loadClasses() {
    this.schoolClassService.getAllClasses().then((classes: SchoolClass[]) => {
      console.log(classes);
      this.classes = classes;

      this.classesDataSource.data = this.classes;
      this.paginator.firstPage();
    });
  }

  get sections(): FormArray {
    return this.classForm.get('sections') as FormArray;
  }

  createSection(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      teacherId: ['', [Validators.required]],
      capacity: [30, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  addSection() {
    this.sections.push(this.createSection());
  }

  removeSection(index: number) {
    if (this.sections.length > 1) {
      this.sections.removeAt(index);
    }
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.availableTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.firstName + ' ' + teacher.lastName : '';
  }

  async onSubmit() {
    if (this.classForm.valid) {
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
        this.classForm.reset();
      } catch (error) {
        this.snackBar.open('Error saving class', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }

      // const classData: Class = {
      //   id: this.generateId(),
      //   name: this.classForm.value.name,
      //   grade: this.classForm.value.grade,
      //   academicYear: this.classForm.value.academicYear,
      //   sections: this.classForm.value.sections.map((section: any, index: number) => ({
      //     id: `SEC${index + 1}`,
      //     name: section.name,
      //     teacherId: section.teacherId,
      //     capacity: section.capacity
      //   }))
      // };

      // console.log('New Class Created:', classData);

      // In a real app, you would send this to a service


      // Reset form

      // this.sections.clear();
      // this.addSection();
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  onSubmitSection() { }

  private generateId(): string {
    return 'CLS' + Date.now().toString();
  }
}
