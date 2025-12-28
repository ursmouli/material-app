import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    // Check if the route has restricted roles
    const expectedRole = route.data['role'];
    if (expectedRole && !authService.hasRole(expectedRole)) {
      router.navigate(['/dashboard']); // Redirect if role doesn't match
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};