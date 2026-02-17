import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NewClassComponent } from './school-class/school-class.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { AssignSubjectsComponent } from './assign-subjects/assign-subjects.component';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';
import { LocationComponent } from './location/location.component';
import { StudentListComponent } from './student-list/student-list.component';
import { DepartmentComponent } from './department/department.component';
import { SectionComponent } from './section/section.component';
import { TestComponent } from './test/test.component';
import { EmployeeDepartmentComponent } from './employee-department/employee-department.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { PickupPointComponent } from './pickup-point/pickup-point.component';
import { AssignRouteComponent } from './assign-route/assign-route.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { vehicleResolver } from './common/resolver/vehicle.resolver';
import { VehicleRouteComponent } from './vehicle-route/vehicle-route.component';

export const routes: Routes = [
    { path: 'test', component: TestComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'user', 
        component: UserHomeComponent, 
        children: [
            { path: '', component: UserDashboardComponent }
        ]
    },
    {
        path: 'admin', 
        component: AdminHomeComponent,
        children: [
            { path: '', component: AdminDashboardComponent },

            /* Settings */
            { path: 'location', component: LocationComponent },
            { path: 'departments', component: DepartmentComponent },

            /* Employees */
            { path: 'employees', component: EmployeeListComponent },
            { path: 'add-employee', component: EmployeeRegistrationComponent },
            { path: 'employee-departments', component: EmployeeDepartmentComponent },

            /* Students */
            { path: 'students', component: StudentListComponent },
            { path: 'add-student', component: StudentRegistrationComponent },

            /* Subjects */
            { path: 'subjects', component: SubjectsComponent },
            { path: 'assign-subject', component: AssignSubjectsComponent },

            /* Classes & Sections */
            { path: 'classes', component: NewClassComponent },
            { path: 'sections', component: SectionComponent },

            /* Transportation */
            { path: 'routes', component: VehicleRouteComponent },
            { path: 'vehicles', component: VehicleComponent },
            { path: 'stops', component: PickupPointComponent },
            { path: 'assign-route', component: AssignRouteComponent },
            { path: 'vehicle/edit/:id', component: VehicleEditComponent, resolve: { vehicleData: vehicleResolver } },
            { path: 'vehicle/add', component: VehicleEditComponent }
        ] 
    },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
