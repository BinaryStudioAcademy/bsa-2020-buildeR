import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: firebase.User;
  currentUser: User = undefined;
  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router) {
    this.angularAuth.authState.subscribe(user => {
      this.configureAuthState(user);
    });
  }

  configureAuthState(user: firebase.User): void {
    if (user) {
      user.getIdToken().then((theToken) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('jwt', theToken);
        this.signInWithUid(this.getUIdLocalStorage());
      });
    }
    else {
      this.user = null;
    }
  }

  signInWithUid(uid: string) {
    this.userService.login(uid)
      .subscribe((resp) => {
        if (resp.body !== null) {
          this.currentUser = resp.body;
          this.router.navigate(['/portal']);
        }
      });
  }

  registerUser(user: NewUser) {
    this.userService.register(user).subscribe(
      (resp) => {
        if (resp.body !== null) {
          this.currentUser = resp.body;
          this.router.navigate(['/portal']);
        } else {
        }
      },
      (error) => {

      });
  }

  logout(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.currentUser = undefined;
    this.router.navigate(['/']);
    return this.angularAuth.signOut();
  }

  cancelRegistration(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.currentUser = undefined;
    return this.angularAuth.signOut();
  }

  getToken(): string {
    return localStorage.getItem('jwt');
  }

  getUser(): User {
    return this.currentUser;
  }

  setUser(user: User): void {
    this.currentUser = user;
  }

  getUIdLocalStorage(): string {
    const user: firebase.User = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      return user.uid;
    } else {
      return '';
    }
  }

  public isAuthorized() {
    if (this.currentUser === undefined) {

      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
