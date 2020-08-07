import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthenticationService)
    {}


    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.checkForActivation(state);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.checkForActivation(state);
  }

  private checkForActivation(state: RouterStateSnapshot) {
      if (this.authService.getUser() !== null || this.authService.getUser() !== undefined) {
          return true;
      }

      this.router.navigate(['/']);

      return false;
  }
}
