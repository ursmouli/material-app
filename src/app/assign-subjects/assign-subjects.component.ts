import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { SchoolClass, Section } from '../common/model/model-interfaces';
import { SectionSubject, SectionSubjectId, Subject } from '../common/model/subject';
import { SectionService } from '../common/services/section.service';
import { SubjectService } from '../common/services/subject.service';

@Component({
  selector: 'app-assign-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './assign-subjects.component.html',
  styleUrl: './assign-subjects.component.scss'
})
export class AssignSubjectsComponent implements OnInit {
  sections: Section[] = [];

  selectdSection: Section | null = null;
  availableSubjects: Subject[] = [];

  sectionService = inject(SectionService);
  subjectService = inject(SubjectService);

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {

    this.sectionService.getAllSections().then(sections => {
      this.sections = sections;
      console.log(this.sections);
    });

    this.subjectService.getSubjects().then(subjects => {
      this.availableSubjects = subjects;
      console.log(this.availableSubjects);
    });
  }

  onClassChange() {
    this.updateAvailableSubjects();
  }

  private updateAvailableSubjects() {
    if (!this.selectdSection) {
      this.availableSubjects = [];
      return;
    }

    this.availableSubjects = this.availableSubjects.filter(subject => 
      !this.selectdSection?.sectionSubjects?.some(sectionSubject => sectionSubject.subject?.code === subject.code)
    );
  }

  assignSubject(subject: Subject) {
    if (!this.selectdSection) return;

    // assign subject to selected section
    console.log("assigning subject", subject);
    
    this.selectdSection!.sectionSubjects!.push({
      subject: subject
    });

    this.sectionService.assignSubjectToSection(this.selectdSection!).then(section => {
      this.selectdSection = section;
      this.updateAvailableSubjects();
    });

    this.showMessage(`Subject "${subject.name}" assigned to class successfully!`);
  }

  removeSubject(subject: SectionSubject) {
    if (!this.selectdSection || !this.selectdSection.sectionSubjects) return;

    const index = this.selectdSection.sectionSubjects.findIndex(s => s.subject?.id === subject.subject?.id);
    if (index > -1) {
      console.log("removing subject", subject);

      this.sectionService.removeSubjectFromSection(this.selectdSection?.schoolClass.id!, this.selectdSection?.classTeacher.id!, subject.subject!.id!).then(() => {
        this.selectdSection!.sectionSubjects!.splice(index, 1);

        this.availableSubjects.push(subject.subject!);
        this.updateAvailableSubjects();
      });


      this.showMessage(`Subject "${subject.subject?.name}" removed from class successfully!`);
    }
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  getAssignedSubjects(): SectionSubject[] {
    return this.selectdSection?.sectionSubjects || [];
  }
}
