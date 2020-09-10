import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Providers } from '@shared/models/providers';
import { LinkProvider } from '@shared/models/user/link-provider';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
import { UserSocialNetwork } from '@shared/models/user/user-social-network';
import { auth, UserInfo } from 'firebase';
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
              if (this.isGithubAddedInFirebase(user)
                && !this.isProviderAdded(userResult, Providers.Github)) {
                this.linkUserProviderInDb(userResult, Providers.Github, null, user);
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
    return Boolean(this.getFireUser()) && Boolean(this.getCurrentUser());
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

  isGithubAddedInFirebase(firebaseUser?: firebase.User) {
    const check = (item: UserInfo) => item.providerId === 'github.com';
    return firebaseUser ? firebaseUser.providerData.some(check) : this.firebaseUser.providerData.some(check);
  }

  isProviderAdded(user: User, provider: Providers) {
    if (user.userSocialNetworks === null) {
      return true;
    }
    const check = (item: UserSocialNetwork) => item.providerName === provider;
    return user.userSocialNetworks?.some(check);
  }

  linkUserProviderInDb(user: User, provider: Providers, credential?: auth.UserCredential, fireUser?: firebase.User) {
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
    const linkUser = ({
      userId: user.id,
      providerName: provider,
      providerUrl: providerUrlId,
      uId: credential !== null ? credential.user.uid : fireUser.uid
    } as LinkProvider);
    this.userService.linkProvider(linkUser)
      .subscribe((response) => {
        if (response) {
          this.setUser(response);
          user = response;
        }
      });
  }
}
