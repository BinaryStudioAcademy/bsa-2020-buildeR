import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Resolve,
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../../shared/models/user/user';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<User> {
  constructor(private authService: AuthenticationService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.loadCurrentUser().pipe(catchError(() => {
      this.authService.logout();
      return EMPTY;
    }));
  }
}
