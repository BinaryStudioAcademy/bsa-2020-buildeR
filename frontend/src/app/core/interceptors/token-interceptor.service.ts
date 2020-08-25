import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError, of } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { switchMap, catchError, filter, take, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) { }
  authRequest = null;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authService.isAuthorized) {
      const jwt = this.authService.getToken();
      if (jwt) {
        const header = 'Bearer ' + jwt;
        const reqWithAuth = req.clone({ headers: req.headers.set('Authorization', header) });
        return next.handle(reqWithAuth);
      }
    }
    else {
      this.authRequest = from(this.authService.refreshToken());
      this.authService.stateChanged();
    }

    if (!this.authRequest) {
      this.authRequest = this.authService.getIdToken();
    }

    return this.authRequest.pipe(
      switchMap((token: string) => {
        this.authRequest = null;
        if (token) {
          this.authService.stateChanged();
          const header = 'Bearer ' + token;
          const reqAuth = req.clone({ headers: req.headers.set('Authorization', header) });
          return next.handle(reqAuth);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          if (!this.authRequest) {
            this.authRequest = from(this.authService.refreshToken());
            if (!this.authRequest) {
              return throwError(error);
            }
          }
          return this.authRequest.pipe(
            switchMap((newToken: string) => {
              this.authRequest = null;
              if (newToken) {
                this.authService.stateChanged();
                const header = 'Bearer ' + newToken;
                const authReqRepeat = req.clone({ headers: req.headers.set('Authorization', header) });
                return next.handle(authReqRepeat);
              }
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
