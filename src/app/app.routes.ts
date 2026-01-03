import { Routes } from '@angular/router';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponentsComponent } from './test-components/test-components.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NewClassComponent } from './new-class/new-class.component';
import { ClassesComponent } from './classes/classes.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { AssignSubjectsComponent } from './assign-subjects/assign-subjects.component';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';

export const routes: Routes = [
    { path: 'test', component: TestComponentsComponent },
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
            { path: 'subjects', component: SubjectsComponent },
            { path: 'assign-subject', component: AssignSubjectsComponent },
            { path: 'classes', component: ClassesComponent },
            { path: 'new-class', component: NewClassComponent },
            { path: 'employee-registration', component: EmployeeRegistrationComponent },
            { path: 'employee-list', component: EmployeeListComponent },
            { path: 'add-student', component: StudentRegistrationComponent }
        ] 
    },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
