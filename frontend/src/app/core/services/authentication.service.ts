import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from, of } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import { UserInfo } from 'firebase';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
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
        this.populateAuth(result.token, user);
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
    return !currentToken || this.tokenHelper.isTokenExpired(currentToken)
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
      tap(token => localStorage.setItem('jwt', token))
    );
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
    return Boolean(this.getFireUser());
  }

  populateAuth(jwt: string, user: firebase.User) {
    this.firebaseUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt', jwt);
  }

  clearAuth() {
    localStorage.removeItem('github-access-token');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.firebaseUser = undefined;
    this.currentUser = undefined;
  }

  isGithubAddedInFirebase() {
    const check = (item: UserInfo) => item.providerId === 'github.com';
    return this.firebaseUser.providerData.some(check);
  }
}
