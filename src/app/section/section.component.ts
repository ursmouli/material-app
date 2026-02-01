import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SchoolClass, Section } from '../common/model/model-interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { SchoolClassSectionService } from '../common/services/school-class-section.service';
import { EmployeeService } from '../common/services/employee.service';
import { Employee } from '../common/model/registration';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { PageResponse, Pagination } from '../common/model/pagination';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    MatPaginatorModule
],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnInit {

  sectionForm: FormGroup;
  displayedColumns: string[] = ['name', 'class', 'classTeacher', 'actions'];

  sectionsDataSource = new MatTableDataSource<Section>();

  classSectionService = inject(SchoolClassSectionService);
  employeeService = inject(EmployeeService);

  editingRow: number | null = null;
  isNewSection: boolean = false;

  teachers: Employee[] = [];
  classes: SchoolClass[] = [];

  // Pagination variables
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  sortField = 'name';
  sortDirection = 'ASC';

  searchSubject = new Subject<string>()
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.sectionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      schoolClassId: new FormControl('', [Validators.required]),
      classTeacherId: new FormControl('', [Validators.required]),
    });

    this.employeeService.getTeachers().then((teachers) => {
      console.log(teachers);
      this.teachers = teachers;
    });

    this.classSectionService.getClasses().then((classes) => {
      console.log(classes);
      this.classes = classes;
    });
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchTerm = value;
      this.loadSections();
    });

    this.loadSections();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSections();
  }

  loadSections() {
    const pagination: Pagination = {
      page: this.pageIndex, 
      size: this.pageSize, 
      sortField: this.sortField, 
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm
    };

    this.classSectionService.getSections(pagination).then((sections: PageResponse<Section>) => {
      this.sectionsDataSource.data = sections.content;
    });
  }

  addNewSection() {
    this.isNewSection = true;
    this.editingRow = null;
    this.sectionForm.reset();

    const newSection: Partial<Section> = {
      name: '',
      schoolClass: {name: ''},
      classTeacher: {employeeNumber: ''}
    };
    this.sectionsDataSource.data = [newSection as Section, ...this.sectionsDataSource.data];
    this.editingRow = 0;
  }

  saveNewSection() {
    if (this.sectionForm.invalid) {
      return;
    }

    const newSection: Section = {
      name: this.sectionForm.value.name,
      schoolClass: {id: this.sectionForm.value.schoolClassId},
      classTeacher: {id: this.sectionForm.value.classTeacherId}
    }
    console.log(newSection);
    this.classSectionService.saveSection(newSection).then((section: Section) => {
      this.sectionsDataSource.data.push(section);
      this.sectionForm.reset();
    });
  }

  isEditingRow(index: number): boolean {
    return this.editingRow === index;
  }

  startEdit(row: Section, index: number) {
    this.editingRow = index;
    this.sectionForm.patchValue({
      name: row.name,
      schoolClassId: row.schoolClass.id,
      classTeacherId: row.classTeacher.id
    });
  }

  saveEdit() {
    this.editingRow = null;
    this.sectionForm.reset();
  }

  deleteSection(index: number) {
    this.sectionsDataSource.data.splice(index, 1);
    this.sectionsDataSource.data = [...this.sectionsDataSource.data];
  }

  cancelEdit() {
    if (this.isNewSection) {
      this.sectionsDataSource.data = this.sectionsDataSource.data.filter((_, index) => index !== this.editingRow);

      this.isNewSection = false;
      this.editingRow = null;
      this.sectionForm.reset();
    } else {
      this.editingRow = null;
      this.sectionForm.reset();
    }
  }
}
