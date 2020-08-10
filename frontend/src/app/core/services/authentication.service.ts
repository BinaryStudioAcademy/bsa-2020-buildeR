import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CurrentUser } from '@shared/models/current-user';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(new CurrentUser());

  constructor(private angularAuth: AngularFireAuth,
              private router: Router,
              private httpClient: HttpClient) {
    this.angularAuth.authState.subscribe((firebaseUser) => {
      this.configureAuthState(firebaseUser);
    });
  }

  configureAuthState(firebaseUser: firebase.User): void {
    if (firebaseUser) {
      firebaseUser.getIdToken().then((theToken) => {
        const theUser = new CurrentUser();
        theUser.displayName = firebaseUser.displayName;
        theUser.email = firebaseUser.email;
        theUser.isSignedIn = true;
        localStorage.setItem('jwt', theToken);
        this.user$.next(theUser);
      }, () => {
        this.doSignedOutUser();
      });
    } else {
      this.doSignedOutUser();
    }
  }

  doGoogleSignIn(): Promise<void> {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    return this.angularAuth.signInWithPopup(googleProvider).then(() => { });
  }

  doGithubSignIn(): Promise<void> {
    const githubProvider = new firebase.auth.GithubAuthProvider();
    return this.angularAuth.signInWithPopup(githubProvider).then((auth) => {
      // username only for github
      // console.log(auth.additionalUserInfo.username);
    });
  }

  private doSignedOutUser() {
    const theUser = new CurrentUser();
    theUser.displayName = null;
    theUser.email = null;
    theUser.isSignedIn = false;
    localStorage.removeItem('jwt');
    this.user$.next(theUser);
  }

  logout(): Promise<void> {
    return this.angularAuth.signOut();
  }

  getUserObservable(): Observable<CurrentUser> {
    return this.user$.asObservable();
  }

  getToken(): string {
    return localStorage.getItem('jwt');
  }
}
