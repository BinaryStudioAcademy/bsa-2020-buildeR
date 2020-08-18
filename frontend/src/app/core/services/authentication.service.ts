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
  private currentUser: User;
  private firebaseUser: firebase.User;

  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {
    this.angularAuth.authState.subscribe(this.configureAuthState);
  }

  configureAuthState = (user: firebase.User) => {
    if (user) {
      return user.getIdToken().then((token) => {
        this.populateAuth(token, user);
        return this.loadCurrentUser();
      });
    }

    this.clearAuth();
  }

  async loadCurrentUser(force?: boolean) {
    if (!this.currentUser || force) {
      this.currentUser = await this.userService.login(this.firebaseUser.uid).toPromise();
    }

    return this.currentUser;
  }

  registerUser(newUser: NewUser) {
    this.userService.register(newUser).subscribe(
      user => {
        this.currentUser = user;
        this.router.navigate(['/portal']);
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
