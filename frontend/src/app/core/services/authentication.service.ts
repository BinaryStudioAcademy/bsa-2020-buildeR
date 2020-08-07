import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import { UserService } from './user.service';
import { User } from '../../shared/models/user';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: User;

  constructor(private httpService: HttpService, private userService: UserService) {}

  public getUser(): User {
      return JSON.parse(localStorage.getItem[`user`]);
  }

  public setUser(user: User) {
    localStorage.setItem[`user`] = JSON.stringify(user);
  }

  public login(accessToken: string) {
    return this.userService.getUserByToken(accessToken).subscribe((response) => {
      this.user = response;
      this.setUser(this.user);
    });
  }

  public logout() {
    this.user = undefined;
    this.removeUserFromStorage();
  }

  public removeUserFromStorage() {
    localStorage.removeItem('user');
  }
}
