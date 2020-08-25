import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NewUser } from '@shared/models/user/new-user';
import { User } from '@shared/models/user/user';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: User;
  private firebaseUser: firebase.User;

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

  getToken(): string {
    return localStorage.getItem('jwt');
  }

  getIdToken() {
    return this.angularAuth.idToken;
  }

  stateChanged() {
    this.angularAuth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((jwt) => {
          this.populateAuth(jwt, user);
        });
      }
    });
  }
  public refreshToken(): Observable<string> {
    return this.angularAuth.authState.pipe(
      filter((user) => Boolean(user)),
      mergeMap(async (user) => await user.getIdToken(true))
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

  setUser(user: User) {
    this.currentUser = user;
  }

  isAuthorized() {
    return Boolean(this.getFireUser());
  }

  populateAuth(jwt: string, user: firebase.User/*, githubToken: string*/) {
    this.firebaseUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt', jwt);
    // localStorage.setItem('github-access-token', githubToken);
  }

  clearAuth() {
    localStorage.removeItem('github-access-token');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.firebaseUser = undefined;
    this.currentUser = undefined;
  }
}
