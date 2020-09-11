import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  tokenRequest$: Observable<string>;

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.authService.isAuthorized() || req.url.includes('/login')) {
      return next.handle(req);
    }

    if (!this.tokenRequest$) {
      this.tokenRequest$ = this.authService.getFirebaseToken();
    }

    return this.tokenRequest$.pipe(
      switchMap(token => {
        this.tokenRequest$ = null;
        return next.handle(this.setToken(req, token));
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(error);
        }
        if (!this.tokenRequest$) {
          this.tokenRequest$ = this.authService.refreshFirebaseToken();
        }
        return this.tokenRequest$.pipe(
          switchMap(newToken => {
            this.tokenRequest$ = null;
            return next.handle(this.setToken(req, newToken));
          })
        );
      })
    );
  }

  private setToken = (request: HttpRequest<unknown>, token: string) =>
    token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` }}) : request
}
