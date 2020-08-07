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

  public getUser(): string {
    if(localStorage[`username`] === '')
    {
      return null;
    }
    return localStorage[`username`];
  }

  public setUser(user: User) {
    localStorage.setItem(`username`, user.username);
  }

  public login(accessToken: string) {
    return this.userService.getUserByToken(accessToken).subscribe((response) => {
      this.user = response;
      this.setUser(this.user);
      console.log(localStorage[`username`]);
      this.router.navigate(['/portal']);
    });
  }

  public logout() {
    this.user = undefined;
    this.removeUserFromStorage();
  }

  public removeUserFromStorage() {
    localStorage.removeItem('username');
  }
}
