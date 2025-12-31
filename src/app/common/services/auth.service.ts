import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('school_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) {

    localStorage.setItem('school_user', JSON.stringify(user));

    this.currentUserSubject.next(user);
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user.role === 'user') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  logout(): void {
    localStorage.removeItem('school_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }


}
