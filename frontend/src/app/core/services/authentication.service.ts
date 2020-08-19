import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
import { UserService } from './user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: User;
  private firebaseUser: firebase.User;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) { }

  configureAuthState = (user: firebase.User) => {
    if (user) {
      return user.getIdToken().then((token) => {
        this.populateAuth(token, user);
        return this.loadCurrentUser();
      });
    }

    this.clearAuth();
  }

  getAngularAuth() {
    return this.angularAuth;
  }

  async loadCurrentUser(force?: boolean) {
    if (!this.currentUser || force) {
      this.currentUser = await this.userService.login(this.firebaseUser.uid).toPromise();
    }

    return this.currentUser;
  }

  registerUser(newUser: NewUser) {
    this.userService.register(newUser).subscribe(
      userResult => {
        this.angularAuth.authState
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((user) => {
            this.configureAuthState(user);
            if (user) {
              if (user.uid === userResult.userSocialNetworks[0].uId) {
                this.currentUser = userResult;
                this.router.navigate(['/portal']);
              }
            }
          });
      });
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/']);
    return this.angularAuth.signOut();
  }

  cancelRegistration(): Promise<void> {
    this.clearAuth();
    return this.angularAuth.signOut();
  }

  getToken(): string {
    return localStorage.getItem('jwt');
  }

  refreshToken() {
    return this.firebaseUser.getIdToken().then((theToken) => {
      localStorage.setItem('jwt', theToken);
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getFireUser() {
    if (!this.firebaseUser) {
      this.firebaseUser = JSON.parse(localStorage.getItem('user'));
    }

    return this.firebaseUser;
  }

  setUser(user: User) {
    this.currentUser = user;
  }

  isAuthorized() {
    return Boolean(this.getFireUser());
  }

  populateAuth(jwt: string, user: firebase.User) {
    this.firebaseUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt', jwt);
  }

  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.firebaseUser = undefined;
    this.currentUser = undefined;
  }
}
