import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '@shared/models/user/user';
import * as firebase from 'firebase';
import { UserService } from './user.service';
import { NewUser } from '@shared/models/user/new-user';
import { Providers } from '@shared/models/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationDialogComponent } from '@core/components/registration-dialog/registration-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: firebase.User;
  currentUser: User = undefined;
  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private modalService: NgbModal,
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

  doGoogleSignIn(): Promise<void> {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return this.angularAuth.signInWithPopup(googleProvider).then((auth) => {
      this.isUidExist(auth);
    },
      (error) => console.log("Email exist")
    );
  }

  doGithubSignIn(): Promise<void> {
    const githubProvider = new firebase.auth.GithubAuthProvider();
    githubProvider.addScope('repo');
    githubProvider.addScope('admin:repo_hook');
    return this.angularAuth.signInWithPopup(githubProvider).then(
      (auth) => {
        console.log(auth.credential);
        localStorage.setItem('github-access-token', auth.credential['accessToken']);
        this.isUidExist(auth);
      },
      (error) => console.log("Email exist")
    );
  }

  isUidExist(auth: firebase.auth.UserCredential): void {
    this.userService.login(auth.user.uid)
      .subscribe((resp) => {
        if (resp.body !== null) {
          this.currentUser = resp.body;
          this.router.navigate(['/portal']);
        }
        else {
          if (auth.credential.providerId === 'google.com') {
            this.doGoogleSignUp(auth);
          } else {
            this.doGithubSignUp(auth);
          }
        }
      });
  }

  doGoogleSignUp(credential: firebase.auth.UserCredential) {
    const user = {
      email: credential.user.email,
      username: credential.user.displayName,
      avatarUrl: credential.user.photoURL,
      firstName: credential.additionalUserInfo.profile[`given_name`],
      lastName: credential.additionalUserInfo.profile[`family_name`],
      providerId: Providers.Google,
      uId: credential.user.uid,
      providerUrl: credential.credential.providerId
    } as NewUser;

    const modalRef = this.modalService.open(RegistrationDialogComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.details = user;
  }

  registerUser(user: NewUser) {
    this.userService.register(user).subscribe(
      (resp) => {
        if (resp.body !== null) {
          this.currentUser = resp.body;
          this.router.navigate(['/portal']);
        } else {
          user.username = "This Username has already taken";
          const modalRef = this.modalService.open(RegistrationDialogComponent, { backdrop: 'static', keyboard: false });
          modalRef.componentInstance.details = user;
          modalRef.componentInstance.isUsernameTaken = true;
        }
      },
      (error) => {

      });
  }

  doGithubSignUp(credential: firebase.auth.UserCredential) {
    const user = {
      email: credential.user.email,
      username: credential.additionalUserInfo.username,
      avatarUrl: credential.user.photoURL,
      providerId: Providers.Github,
      uId: credential.user.uid,
      providerUrl: credential.credential.providerId
    } as NewUser;

    const name: string = credential.additionalUserInfo.profile[`name`];
    if (name != null) {
      [user.firstName, user.lastName = ''] = name.split(' ');
    }

    const modalRef = this.modalService.open(RegistrationDialogComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.details = user;
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
