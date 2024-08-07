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
            { path: '', component: AdminDashboardComponent }
        ] 
    },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
