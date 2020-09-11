import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from, of } from 'rxjs';
import { filter, tap, switchMap, map, mergeMap } from 'rxjs/operators';
import { UserInfo } from 'firebase';
import { Providers } from '@shared/models/providers';
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
    if (!user) {
      return this.clearAuth();
    }

    return user.getIdTokenResult()
      .then((result) => this.populateAuth(result.token, user));
  }

  getAngularAuth() {
    return this.angularAuth;
  }

  loadCurrentUser(force?: boolean) {
    if (!this.currentUser || force) {
      return this.userService.login(this.firebaseUser.uid)
        .pipe(tap(user => this.currentUser = user));
    }
    return of(this.currentUser);
  }

  registerUser(newUser: NewUser) {
    this.userService.register(newUser)
      .pipe(
        switchMap(user => this.angularAuth.authState
          .pipe(switchMap(fireUser => from(this.configureAuthState(fireUser))
            .pipe(map(() => ({ user, fireUser })))
          )))
      ).subscribe(({ user, fireUser }) => {
        if (fireUser?.uid === user.userSocialNetworks[0].uId) {
          this.currentUser = user;
          this.router.navigate(['/portal']);
        }
      });
  }

  logout(redirectUrl?: string) {
    return this.clearAuth()
      .then(() => this.router.navigate([redirectUrl ? redirectUrl : '/']));
  }

  cancelRegistration() {
    return this.clearAuth();
  }

  getFirebaseToken() {
    const currentToken = localStorage.getItem('jwt');
    return !currentToken || this.tokenHelper.isTokenExpired(currentToken)
      ? this.refreshFirebaseToken()
      : of(currentToken);
  }

  refreshFirebaseToken() {
    return this.angularAuth.authState.pipe(
      filter(user => Boolean(user)),
      mergeMap(user => from(user.getIdToken(true))),
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
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.firebaseUser = undefined;
    this.currentUser = undefined;
    return this.angularAuth.signOut();
  }

  isProviderAddedInFirebase(provider: Providers, firebaseUser?: firebase.User) {
    const check = (item: UserInfo) => item.providerId === this.checkProviderUrl(provider);
    return firebaseUser ? firebaseUser.providerData.some(check) : this.firebaseUser?.providerData.some(check);
  }

  checkProviderUrl(provider: Providers) {
    let providerUrlId: string;
    switch (provider) {
      case Providers.Google: {
        providerUrlId = 'google.com';
        break;
      }
      case Providers.Github: {
        providerUrlId = 'github.com';
        break;
      }
    }
    return providerUrlId;
  }
}
