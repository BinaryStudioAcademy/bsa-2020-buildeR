import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { UserService } from './user.service';
import { User } from '../../shared/models/user';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: User = null;

  constructor(private router: Router, private userService: UserService) {}

  getUser(): User {
    if (this.user) {
      return this.user;
    }
    return JSON.parse(localStorage.getItem(`user`));
  }

  public setUser(user: User) {
    localStorage.setItem(`user`, JSON.stringify(user));
  }

  public login(accessToken: string) {
    return this.userService.getCurrentUser().subscribe((response) => {
      this.user = response;
      this.setUser(this.user);
      this.router.navigate(['/portal']);
    });
  }

  public logout() {
    this.user = undefined;
    this.removeUserFromStorage();
    this.router.navigate(['/']);
  }

  public removeUserFromStorage() {
    localStorage.clear();
  }

  public isAuthorized() {
    if (!this.getUser()) {

      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
