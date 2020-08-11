import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '@shared/models/user';
import * as firebase from 'firebase';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: firebase.User;
  currentUser = {} as User;
  constructor(private angularAuth: AngularFireAuth, private userService: UserService, private router: Router) {
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
      });
    }
    else {
      this.user = null;
    }
  }

  doGoogleSignIn(): Promise<void> {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return this.angularAuth.signInWithPopup(googleProvider).then((auth) => {
      this.doGoogleSignUp(auth);
      this.router.navigate(['/portal']);
    });
  }

  doGithubSignIn(): Promise<void> {
    const githubProvider = new firebase.auth.GithubAuthProvider();
    return this.angularAuth.signInWithPopup(githubProvider).then((auth) => {
      this.doGithubSignUp(auth);
      this.router.navigate(['/portal']);
    });
  }

  doGoogleSignUp(credential: firebase.auth.UserCredential) {
    const user = {} as User;
    user.email = credential.user.email;
    user.username = credential.user.displayName;
    user.avatarUrl = credential.user.photoURL;
    user.firstName = credential.additionalUserInfo.profile[`given_name`];
    user.lastName = credential.additionalUserInfo.profile[`family_name`];
    this.userService.createUser(user)
      .subscribe(
        (resp) => {
          this.currentUser = resp.body;
        },
        (error) => console.log(error));
  }

  doGithubSignUp(credential: firebase.auth.UserCredential) {
    const user = {} as User;
    user.email = credential.user.email;
    user.username = credential.additionalUserInfo.username;
    user.avatarUrl = credential.user.photoURL;
    const name: string = credential.additionalUserInfo.profile[`name`];
    if (name !== null)
    {
      const names: string[] = name.split(' ');
      user.firstName = names[0];
      user.lastName = names[1];
    }
    this.userService.createUser(user).subscribe(
      (resp) => {
        this.currentUser = resp.body;
      },
      (error) => console.log(error));
  }

  logout(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
    return this.angularAuth.signOut();
  }

  getToken(): string {
    return localStorage.getItem('jwt');
  }

  getUser(): User {
    return this.currentUser;
  }

  public isAuthorized() {
    if (!this.currentUser) {

      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
