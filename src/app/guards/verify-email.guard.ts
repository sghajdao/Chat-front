import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const verifiedEmailGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const userEmail = userService.getEmail();
  if (userEmail) {
    return userService.getUserByEmail().pipe(
      map(user=> {
        if (!user.verifiedEmail) {
          router.navigateByUrl('/verify-email')
          return false;
        }
        return true;
      })
    )
  }
  return false;
};
