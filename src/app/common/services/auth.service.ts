import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/user';

import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  router = inject(Router);
  http = inject(HttpClient);

  constructor() {
    const storedUser = localStorage.getItem('school_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async login(user: User) {

    const userInfo: User = await firstValueFrom(this.http.post<User>(`${this.apiUrl}/auth/login`, user));

    if (userInfo) {
      this.currentUserSubject.next(userInfo);
      if (userInfo.roles?.includes('admin')) {
        this.router.navigate(['/admin']);
      } else if (userInfo.roles?.includes('user')) {
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/welcome']);
      }
    }

    localStorage.setItem('school_user', JSON.stringify(userInfo));
  }

  logout(): void {
    localStorage.removeItem('school_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean | undefined {
    return this.currentUserSubject.value?.roles?.includes(role);
  }


}
