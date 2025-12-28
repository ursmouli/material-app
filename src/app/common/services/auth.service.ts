import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  token: string;
  role: 'admin' | 'user' | 'teacher' | 'student';
}

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

  login(email: string, password: string, userRole: 'admin' | 'user' | 'teacher' | 'student') {
    // Dummy authentication logic
    const mockUser: User = {
      id: 1,
      email: email,
      token: 'dummy-jwt-token',
      role: userRole,
    };

    localStorage.setItem('school_user', JSON.stringify(mockUser));

    this.currentUserSubject.next(mockUser);
    this.router.navigate(['/dashboard']);
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
