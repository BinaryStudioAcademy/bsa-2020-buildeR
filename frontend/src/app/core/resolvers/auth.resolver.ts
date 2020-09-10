import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve, RouterStateSnapshot
} from '@angular/router';
import { User } from '../../shared/models/user/user';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<User> {
  constructor(private authService: AuthenticationService) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = await this.authService.loadCurrentUser();
    if (!user) {
      this.authService.logout();
      return;
    }
    return user;
  }
}
