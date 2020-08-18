import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError, of } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { switchMap, catchError, filter, take, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshTokenInProgress = false;

  constructor(private auth: AuthenticationService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.auth.isAuthorized()) {
      return next.handle(request);
    }

    const token = this.auth.getToken();
    if (token) {
      const header = 'Bearer ' + token;
      const reqWithAuth = request.clone({ headers: request.headers.set('Authorization', header) });
      return next.handle(reqWithAuth);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          request.url.includes('refreshtoken') ||
          request.url.includes('login')
        ) {

          if (request.url.includes('refreshtoken')) {
            this.auth.logout();
          }

          return throwError(error);
        }

        if (error && error.status === 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;

            this.refreshTokenSubject.next(null);

            return this.refreshAccessToken().pipe(
              switchMap((success: boolean) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.addAuthenticationToken(request));
              }),
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          return throwError(error);
        }
      })
    ) as Observable<HttpEvent<any>>;
  }

  private refreshAccessToken(): Observable<any> {
    return of(this.auth.refreshToken());
  }

  addAuthenticationToken(request) {
    const accessToken = this.auth.getToken();

    if (!accessToken) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: this.auth.getToken()
      }
    });
  }
}
