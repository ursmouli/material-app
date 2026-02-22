import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Student } from '../common/model/registration';
import { AssignedRoute, PickupPoint, VehicleRoute } from '../common/model/transport-models';
import { StudentService } from '../common/services/student.service';
import { PickupPointService } from '../common/services/pickup-point.service';
import { VehicleRouteService } from '../common/services/vehicle-route.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { NotificationService } from '../common/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-assign-route',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIcon,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './assign-route.component.html',
  styleUrl: './assign-route.component.scss'
})
export class AssignRouteComponent implements OnInit {

  assignRouteForm: FormGroup;

  searchValue = '';
  searchSubject = new Subject<string>();

  studnets: Student[] = [];
  vehicleRoutes: VehicleRoute[] = [];
  pickupPoints: PickupPoint[] = [];
  pickupPointsStudents!: VehicleRoute;
  assignedRoutes: AssignedRoute[] = [];

  studentService = inject(StudentService);
  vehicleRouteService = inject(VehicleRouteService);
  pickupPointService = inject(PickupPointService);
  notificationService = inject(NotificationService);

  assignRouteDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['student', 'route', 'stop', 'actions'];

  selectedRoute: VehicleRoute | null = null;
  filteredStudents!: Observable<Student[]>;

  readonly dialog = inject(MatDialog);

  constructor() {
    this.assignRouteForm = new FormGroup({
      student: new FormControl('', [Validators.required]),
      stop: new FormControl('', [Validators.required])
    });
  }

  async ngOnInit() {
    this.studnets = await this.studentService.getAllStudents();;
    this.vehicleRoutes = await this.vehicleRouteService.getRoutes();;

    this.filteredStudents = this.assignRouteForm.get('student')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.firstName;
        return name ? this._filter(name) : this.studnets.slice();
      })
    );

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue = value;
      this.searchAssignedStops(value);
    });
  }

  searchAssigned(value: Event) {
    const target = value.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  searchAssignedStops(value?: string) {
    const searchText = value?.toLowerCase();

    console.log('Searching for:', searchText);
    console.log('Assigned route:', this.assignedRoutes);

    this.assignRouteDataSource.data = this.assignedRoutes.filter(assingedRoute => {
      const fullName = `${assingedRoute.studentName || ''} ${assingedRoute.studentRollNumber || ''}`;
      const stopName = assingedRoute.stopName || '';
      return fullName.toLowerCase().includes((searchText || '').toLowerCase()) || stopName.toLowerCase().includes((searchText || '').toLowerCase());
    });
  }

  private _filter(name: string): Student[] {
    const filterValue = name.toLowerCase();
    return this.studnets.filter(s => {
      const firstName = s.firstName?.toLowerCase() || '';
      const lastName = s.lastName?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`;
      return fullName.includes(filterValue) || firstName.includes(filterValue) || lastName.includes(filterValue);
    });
  }

  onRouteChange(event: any) {
    this.selectedRoute = this.vehicleRoutes.find(route => route.id === event.value) || null;

    this.pickupPointService.findByRoute(event.value).then(pickupPoints => {
      this.pickupPoints = pickupPoints;
    });

    this.vehicleRouteService.getPickupPointStudents(event.value).then(result => {
      console.log('Pickup points students:', result);
      this.pickupPointsStudents = result;

      this.assignedRoutes = [];
      if (result.pickupPoints && result.pickupPoints.length > 0) {
        result.pickupPoints.forEach((pickupPoint: PickupPoint) => {
          pickupPoint.students = pickupPoint.students || [];
          if (pickupPoint.students.length > 0) {
            pickupPoint.students.forEach((student: Student) => {
              this.assignedRoutes.push({
                routeName: result.name,
                stopName: pickupPoint.stopName,
                studentName: student.firstName + ' ' + student.lastName,
                studentRollNumber: student.rollNumber || '',
                student: student,
                route: result,
                pickupPoint: pickupPoint
              });
            });
          }
        });

        console.log('Assigned routes:', this.assignedRoutes);
        this.assignRouteDataSource.data = this.assignedRoutes;
      }
    });
  }

  assignRoute() {
    if (this.assignRouteForm.invalid) {
      return;
    }
    if (!this.selectedRoute) {
      return;
    }

    const request = {
      pickupPoint: this.assignRouteForm.value.stop,
      student: this.assignRouteForm.value.student
    };

    this.vehicleRouteService.assignStudentRoute(request.student?.id, request.pickupPoint?.id).then(result => {
      console.log('Route assigned successfully', result);
      this.notificationService.showNotification('Route assigned successfully', 'success');

      this.assignRouteDataSource.data.push({
        routeName: this.selectedRoute?.name || '',
        stopName: request.pickupPoint?.stopName || '',
        studentName: request.student?.firstName + ' ' + request.student?.lastName || '',
        studentRollNumber: request.student?.rollNumber || '',
        student: request.student,
        route: this.selectedRoute,
        pickupPoint: request.pickupPoint
      });

      this.assignRouteDataSource.data = [...this.assignRouteDataSource.data];
    });
  }

  deleteAssignedRoute(element: AssignedRoute) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        title: 'Delete Assigned Route',
        message: 'Are you sure you want to delete this assigned route?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pickupPointService.deleteAssignedStop(element.student?.id!, element.pickupPoint?.id!).then(result => {
          console.log('Assigned route deleted successfully', result);
          this.notificationService.showNotification('Assigned route deleted successfully', 'success');
          this.assignRouteDataSource.data = this.assignRouteDataSource.data.filter((item: AssignedRoute) => item.student?.id !== element.student?.id);
        });
      }
    });
  }

  displayStudentFn(student: Student): string {
    return student ? `${student.firstName} ${student.lastName} (${student.rollNumber})` : '';
  }
}
