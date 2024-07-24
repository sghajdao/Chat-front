import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token");
  if (token) {
    const user:any = jwtDecode(token);
    
    if (Math.floor((new Date).getTime() / 1000) > user.exp) {
      const router = inject(Router)
      router.navigate(['/auth/login'])
      return false;
    }
    return true
  }
  const router = inject(Router)
  router.navigate(['/auth/login'])
  return false
};
