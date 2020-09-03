import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { User } from '@shared/models/user/user';
import { tap, catchError } from 'rxjs/operators/';
import { EMPTY } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User>{

  constructor(private router: Router, private userService: UserService, private authService: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let userId: number = route.params[`userId`];
    if (userId === undefined) {
      userId = this.authService.getCurrentUser().id;
    }
    return this.userService.getUserByIdRequest(userId).pipe(tap((resp) => {
      return resp ?? EMPTY;
    }), catchError(() => {
      this.router.navigateByUrl('/portal/**', { skipLocationChange: true });
      return EMPTY;
    }));
  }
}


