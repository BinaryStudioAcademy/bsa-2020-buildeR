import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
import { UserInfo } from 'firebase';
import { from, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: User;
  private firebaseUser: firebase.User;

  private readonly tokenHelper: JwtHelperService;

  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {
    this.tokenHelper = new JwtHelperService();
  }

  configureAuthState = (user: firebase.User) => {
    if (user) {
      return user.getIdTokenResult().then((result) => {
        this.populateAuth(result.token, result.expirationTime, user);
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
          .subscribe((user) => {
            this.configureAuthState(user);
            if (user && user.uid === userResult.userSocialNetworks[0].uId) {
              this.currentUser = userResult;
              this.router.navigate(['/portal']);
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

  getFirebaseToken() {
    const currentToken = localStorage.getItem('jwt');
    return !currentToken /*|| this.tokenHelper.isTokenExpired(currentToken)*/
      ? this.refreshFirebaseToken()
      : of(currentToken);
  }

  refreshFirebaseToken() {
    const fireUser$ = this.angularAuth.currentUser
      ? from(this.angularAuth.currentUser)
      : this.angularAuth.authState;

    return fireUser$.pipe(
      filter(user => Boolean(user)),
      switchMap(user => user.getIdToken(true)),
      tap(token => this.populateAuth(token, new Date(Date.now()).toUTCString()))
    );
  }

  refreshToken() {
    return this.angularAuth.user.subscribe((user) => {
      if (user) {
        user.getIdTokenResult(true).then((result) => {
          this.populateAuth(result.token, result.expirationTime, user);
          return this.loadCurrentUser();
        });
      }
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

  setFirebaseUser(user: firebase.User) {
    this.firebaseUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  setUser(user: User) {
    this.currentUser = user;
  }

  isAuthorized() {
    if (this.isTokenExpired()) {
      this.refreshToken();
    }
    return Boolean(this.getFireUser());
  }

  populateAuth(jwt: string, time?: string, user?: firebase.User) {
    if (user !== undefined) {
      this.firebaseUser = user;
      localStorage.setItem('user', JSON.stringify(user));
    }

    if (time !== undefined) {
      localStorage.setItem('exp-time', new Date(time).toUTCString());
    }

    localStorage.setItem('jwt', jwt);
  }

  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    localStorage.removeItem('exp-time');
    this.firebaseUser = undefined;
    this.currentUser = undefined;
  }

  isGithubAddedInFirebase() {
    const check = (item: UserInfo) => item.providerId === 'github.com';
    return this.firebaseUser.providerData.some(check);
  }

  isTokenExpired() {
    const expTime = new Date(localStorage.getItem('exp-time'));
    // console.log('expTime1' + expTime);
    expTime.setMinutes(expTime.getMinutes() - 5);
    const now = new Date(Date.now());
    // console.log('expTime2 ' + expTime);
    // console.log('now ' + now);
    // console.log(expTime.getTime() < now.getTime());
    return expTime.getTime() < now.getTime();
  }
}
