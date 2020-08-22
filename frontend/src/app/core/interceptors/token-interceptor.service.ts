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
  // private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // private refreshTokenInProgress = false;


  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   if (!this.authService.isAuthorized()) {
  //     return next.handle(request);
  //   }

  //   const token = this.authService.getToken();
  //   if (token) {
  //     const header = 'Bearer ' + token;
  //     const reqWithAuth = request.clone({ headers: request.headers.set('Authorization', header) });
  //     return next.handle(reqWithAuth);
  //   }

  //   return next.handle(request).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (
  //         request.url.includes('refreshtoken') ||
  //         request.url.includes('login')
  //       ) {

  //         if (request.url.includes('refreshtoken')) {
  //           this.authService.logout();
  //         }

  //         return throwError(error);
  //       }

  //       if (error && error.status === 401) {
  //         if (this.refreshTokenInProgress) {
  //           return this.refreshTokenSubject.pipe(
  //             filter(result => result !== null),
  //             take(1),
  //             switchMap(() => next.handle(this.addAuthenticationToken(request)))
  //           );
  //         } else {
  //           this.refreshTokenInProgress = true;

  //           this.refreshTokenSubject.next(null);

  //           return this.refreshAccessToken().pipe(
  //             switchMap((success: boolean) => {
  //               this.refreshTokenSubject.next(success);
  //               return next.handle(this.addAuthenticationToken(request));
  //             }),
  //             finalize(() => (this.refreshTokenInProgress = false))
  //           );
  //         }
  //       } else {
  //         return throwError(error);
  //       }
  //     })
  //   ) as Observable<HttpEvent<any>>;
  // }

  // private refreshAccessToken(): Observable<any> {
  //   return of(this.authService.refreshToken());
  // }

  // addAuthenticationToken(request) {
  //   const accessToken = this.authService.getToken();

  //   if (!accessToken) {
  //     return request;
  //   }

  //   return request.clone({
  //     setHeaders: {
  //       Authorization: this.authService.getToken()
  //     }
  //   });
  // }

  //authRequest: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  authRequest = null;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authService.isAuthorized) {
      return next.handle(req);
    }

    const jwt = this.authService.getToken();
    if (jwt) {
      const header = 'Bearer ' + jwt;
      const reqWithAuth = req.clone({ headers: req.headers.set('Authorization', header) });
      return next.handle(reqWithAuth);
    }

    // if (!this.authRequest) {
    //   this.authRequest = this.authService.getIdToken();
    // }
    // return this.authRequest.pipe(
    //   switchMap((token: string) => {
    //     this.authRequest = null;
    //     const header = 'Bearer ' + token;
    //     const authReq = req.clone({ headers: req.headers.set('Authorization', header) });
    //     return next.handle(authReq);
    //   }),
    //   catchError((error) => {
    //     if (error.status === 401) {
    //       if (!this.authRequest) {
    //         this.authRequest = from(this.authService.refreshToken());
    //         if (!this.authRequest) {
    //           return throwError(error);
    //         }
    //       }
    //       return this.authRequest.pipe(
    //         switchMap((newToken: string) => {
    //           this.authRequest = null;
    //           const header = 'Bearer ' + newToken;
    //           const authReqRepeat = req.clone({ headers: req.headers.set('Authorization', header) });
    //           return next.handle(authReqRepeat);
    //         })
    //       );
    //     } else {
    //       return throwError(error);
    //     }
    //   })
    // );
  }
}
