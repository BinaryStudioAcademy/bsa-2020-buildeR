import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '@core/services/user.service';
import { RegisterDialogService } from '@core/services/register-dialog.service';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AuthenticationService } from './authentication.service';
import { LinkProvider } from '@shared/models/user/link-provider';
import { Providers } from '@shared/models/providers';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSignInService {

  constructor(
    private angularAuth: AngularFireAuth,
    private userService: UserService,
    private registerDialog: RegisterDialogService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  signInWithGithub(redirectUrl?: string) {
    const githubProvider = new auth.GithubAuthProvider();
    githubProvider.addScope('admin:hooks');
    githubProvider.addScope('repo');
    return this.angularAuth.signInWithPopup(githubProvider).then(
      (credential) => {
        localStorage.setItem('github-access-token', credential.credential[`accessToken`]);
        this.login(credential, redirectUrl);
      },
      (error) => {
        console.log('Need to link with github');
      }
    );
  }

  signInWithGoogle(redirectUrl?: string) {
    const googleProvider = new auth.GoogleAuthProvider();
    return this.angularAuth.signInWithPopup(googleProvider).then((credential) => {
      this.login(credential, redirectUrl);
    },
      (error) => {
        console.log('Need to link with google');
      }
    );
  }

  linkWithGithub() {
    const githubProvider = new auth.GithubAuthProvider();
    const fireUser = this.authService.getFireUser();
    fireUser.linkWithPopup(githubProvider).then((result) => {
      const credential = result.credential;
      const user = result.user;
      const linkUser = {
        userId: this.authService.getCurrentUser().id,
        providerId: Providers.Github,
        providerUrl: credential.providerId,
        uId: user.uid
      } as LinkProvider;
      this.userService.linkProvider(linkUser)
      .subscribe((resp) => {
        if (resp) {
          this.authService.setUser(resp);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  linkWithGoogle() {
    const googleProvider = new auth.GoogleAuthProvider();
    const fireUser = this.authService.getFireUser();
    fireUser.linkWithPopup(googleProvider).then((result) => {
      const credential = result.credential;
      const user = result.user;
      const linkUser = {
        userId: this.authService.getCurrentUser().id,
        providerId: Providers.Google,
        providerUrl: credential.providerId,
        uId: user.uid
      } as LinkProvider;
      this.userService.linkProvider(linkUser)
      .subscribe((resp) => {
        if (resp) {
          this.authService.setUser(resp);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  login(credential: auth.UserCredential, redirectUrl?: string): void {
    this.userService.login(credential.user.uid)
      .subscribe((resp) => {
        if (resp) {
          this.authService.setUser(resp);
          this.router.navigate([redirectUrl ?? '/portal']);
        }
        else {
          this.registerDialog.signUp(credential);
        }
      });
  }
}
