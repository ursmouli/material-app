import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', "actions"];
  dataSource: any[] = [];

  employeeDataSource = new MatTableDataSource<any>();

  constructor() {}

  ngOnInit(): void {
    this.dataSource = [
      {id: 1, name: 'John'},
      {id: 2, name: 'Jane'},
      {id: 3, name: 'Jack'},
    ];
    this.employeeDataSource.data = this.dataSource;
  }

  editingIndex: number = -1;

  isEditing(index: number): boolean {
    return this.editingIndex === index;
  }

  saveEdit(index: number) {
    this.editingIndex = -1;
    this.employeeDataSource.data = this.dataSource;
  }

  cancelEdit(index: number) {
    this.employeeDataSource.data = this.dataSource;
    this.editingIndex = -1;
  }

  startEdit(index: number) {
    this.editingIndex = index;
  }

  deleteRow(index: number) {
    this.dataSource.splice(index, 1);
    this.employeeDataSource.data = this.dataSource;
  }
}
