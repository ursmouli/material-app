import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../common/services/subject.service';
import { DepartmentService } from '../common/services/department.service';
import { Subject } from '../common/model/subject';
import { Department } from '../common/model/department';
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  departments: Department[] = [];
  filteredSubjects: Subject[] = [];
  displayedColumns: string[] = ['id', 'name', 'code', 'description', 'credits', 'department', 'actions'];
  searchTerm: string = '';
  showAddDialog: boolean = false;

  subjectService = inject(SubjectService);
  departmentService = inject(DepartmentService);

  department: Department = {
    id: 0,
    name: ''
  };

  // selectedDepartment?: Department;
  newSubject: Partial<Subject> = {
    name: '',
    code: '',
    description: '',
    credits: 1,
    edit: false
  };

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subjectService.getSubjects().then((value: Subject[]) => {
      this.subjects = value;
      this.filteredSubjects = [...this.subjects];
    });
    this.departmentService.getDepartments().then((value: Department[]) => {
      this.departments = value;
    });
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openAddDialog() {
    this.showAddDialog = true;
    this.newSubject = {
      name: '',
      code: '',
      description: '',
      credits: 100
    };
  }

  closeAddDialog() {
    this.showAddDialog = false;
    this.newSubject.edit = false;
  }

  editSubject(subject: Subject) {
    console.log('Edit subject:', subject);
    this.newSubject = {
      ...subject
    };
    this.newSubject.edit = true;
    this.showAddDialog = true;
  }

  compareFn(dept1: any, dept2: any): boolean {
    return dept1 && dept2 ? dept1.id === dept2.id : dept1 === dept2;
  }

  deleteSubject(subject: Subject) {
    console.log('Delete subject:', subject);
  }

  async updateSubject() {
    console.log('Update subject:', this.newSubject);
    if (this.isValidSubject() && this.newSubject.id) {
      
      const index = this.subjects.findIndex(subject => subject.id === this.newSubject.id);
      if (index !== -1) {
        try {
          const savedSubject = await this.subjectService.addSubject(this.newSubject as Subject);
          this.subjects[index] = savedSubject;
          this.filteredSubjects = [...this.subjects];
          this.message('Subject updated successfully!');
          this.closeAddDialog();
        } catch (error) {
          this.message('Failed to update subject');
          return;
        }
      }
    }
  }

  private message(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  async addSubject() {
    if (this.isValidSubject()) {
      try {
        const savedSubject = await this.subjectService.addSubject(this.newSubject as Subject);
        this.subjects.push(savedSubject);
        this.filteredSubjects = [...this.subjects];
        this.message('Subject added successfully!');
        this.closeAddDialog();
      } catch (error) {
        this.message('Failed to add subject');
        return;
      }
    }
  }

  isValidSubject(): boolean {
    const result = !!this.newSubject.name && !!this.newSubject.code && !!this.newSubject.description && !!this.newSubject.department;
    if (!result) {
      this.message('Please fill in all required fields.');
    }
    return result;
  }
}
