import { Component, OnInit } from '@angular/core';
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
    MatSnackBarModule
  ],
  templateUrl: './new-class.component.html',
  styleUrl: './new-class.component.scss'
})
export class NewClassComponent implements OnInit {
  classForm: FormGroup;
  availableTeachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      grade: ['', [Validators.required]],
      academicYear: ['', [Validators.required]],
      sections: this.fb.array([])
    });
  }

  ngOnInit() {
    // Sample teachers data - in a real app, this would come from a service
    this.availableTeachers = [
      { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@school.com', subject: 'Mathematics' },
      { id: 2, name: 'Mr. Michael Chen', email: 'michael.chen@school.com', subject: 'Science' },
      { id: 3, name: 'Ms. Emily Davis', email: 'emily.davis@school.com', subject: 'English' },
      { id: 4, name: 'Mr. David Wilson', email: 'david.wilson@school.com', subject: 'History' },
      { id: 5, name: 'Mrs. Lisa Brown', email: 'lisa.brown@school.com', subject: 'Geography' }
    ];

    // Add one section by default
    this.addSection();
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
    return teacher ? teacher.name : '';
  }

  onSubmit() {
    if (this.classForm.valid) {
      const classData: Class = {
        id: this.generateId(),
        name: this.classForm.value.name,
        grade: this.classForm.value.grade,
        academicYear: this.classForm.value.academicYear,
        sections: this.classForm.value.sections.map((section: any, index: number) => ({
          id: `SEC${index + 1}`,
          name: section.name,
          teacherId: section.teacherId,
          capacity: section.capacity
        }))
      };

      console.log('New Class Created:', classData);

      // In a real app, you would send this to a service
      this.snackBar.open('Class created successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Reset form
      this.classForm.reset();
      this.sections.clear();
      this.addSection();
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  private generateId(): string {
    return 'CLS' + Date.now().toString();
  }
}
