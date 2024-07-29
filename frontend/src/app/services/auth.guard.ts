import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ApiService } from './api.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ItineraryService } from './itinerary.service';

export const basicAuthGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const router = inject(Router);

  return api.me().pipe(
    switchMap(() => of(true)), // If authenticated, emit true
    catchError((err) => {
      return of(router.createUrlTree(['/'])); // If not authenticated or error, emit UrlTree for redirection
    }),
  );
};

export const pageAuthGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const itineraryApi = inject(ItineraryService);
  const router = inject(Router);

  const itineraryIdParam = route.paramMap.get('itineraryId');
  const itineraryId = itineraryIdParam ? parseInt(itineraryIdParam, 10) : NaN;

  return api.me().pipe(
    switchMap(() => {
      if (itineraryId) {
        return itineraryApi.getItinerary(itineraryId).pipe(
          switchMap(() => of(true)), // If itinerary exists, emit true
          catchError((err) => {
            return of(router.createUrlTree(['/home'])); // If itinerary does not exist or error, emit UrlTree for redirection
          }),
        );
      } else {
        return of(router.createUrlTree(['/'])); // If no itineraryId, redirect to root
      }
    }),
    catchError((err) => {
      return of(router.createUrlTree(['/'])); // If not authenticated or error, emit UrlTree for redirection
    }),
  );
};
