import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  authRequest = null;

  constructor(private authService: AuthenticationService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authService.isAuthorized()) {
      return next.handle(req);
    }

    if (!this.authRequest) {
      this.authRequest = this.authService.getToken();
    }

    return this.authRequest.pipe(
      switchMap((token: string) => {
        this.authRequest = null;
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(authReq);
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
              const authReqRepeat = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(authReqRepeat);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
