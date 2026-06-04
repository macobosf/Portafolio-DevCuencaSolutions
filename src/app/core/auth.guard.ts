import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.isLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() =>
      auth.isAuthenticated() ? true : router.createUrlTree(['/login']),
    ),
  );
};

export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.isLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() =>
      auth.isAuthenticated() ? router.createUrlTree(['/']) : true,
    ),
  );
};

export const programmerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.isLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => (auth.isProgrammer() ? true : router.createUrlTree(['/']))),
  );
};
