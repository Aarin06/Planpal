import { CanActivateFn } from '@angular/router';
import { ApiService } from './api.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  return api.me().pipe(
    switchMap(() => of(true)), // If authenticated, emit true
    catchError((err) => {
      console.error('Authentication check failed:', err);
      return of(false); // If not authenticated or error, emit false
    }),
  );
};
