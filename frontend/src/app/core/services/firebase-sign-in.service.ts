import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterDialogService } from '@core/services/register-dialog.service';
import { UserService } from '@core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Providers } from '@shared/models/providers';
import { LinkProvider } from '@shared/models/user/link-provider';
import { auth } from 'firebase/app';
import { RegistrationWarningComponent } from '../components/registration-warning/registration-warning.component';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSignInService {

  constructor(
    private userService: UserService,
    private registerDialog: RegisterDialogService,
    private router: Router,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) { }

  signInWithGithub(redirectUrl?: string) {
    const githubProvider = new auth.GithubAuthProvider();
    githubProvider.addScope('admin:hooks');
    githubProvider.addScope('repo');
    return this.authService.getAngularAuth().signInWithPopup(githubProvider).then(
      (credential) => {
        localStorage.setItem('github-access-token', credential.credential[`accessToken`]);
        this.login(credential, redirectUrl);
      },
      (error) => {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential': {
            const modalRef = this.modalService.open(RegistrationWarningComponent, { backdrop: 'static', keyboard: false });
            modalRef.componentInstance.linkProvider = Providers.Github;
            modalRef.result.then((res) => {
              switch (res) {
                case Providers.Github: {
                  this.signInWithGithub();
                  break;
                }
                case Providers.Google: {
                  this.signInWithGoogle();
                  break;
                }
              }
            }, (reason) => console.log(reason));
            break;
          }
          case 'auth/cancelled-popup-request': break;
          default: console.log(error);
        }
      }
    );
  }

  signInWithGoogle(redirectUrl?: string) {
    const googleProvider = new auth.GoogleAuthProvider();
    return this.authService.getAngularAuth().signInWithPopup(googleProvider).then((credential) => {
      this.login(credential, redirectUrl);
    },
      (error) => {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential': {
            const modalRef = this.modalService.open(RegistrationWarningComponent, { backdrop: 'static', keyboard: false });
            modalRef.componentInstance.linkProvider = Providers.Google;
            modalRef.result.then((res) => {
              switch (res) {
                case Providers.Github: {
                  this.signInWithGithub();
                  break;
                }
                case Providers.Google: {
                  this.signInWithGoogle();
                  break;
                }
              }
            }, (reason) => console.log(reason));
            break;
          }
          case 'auth/cancelled-popup-request': break;
          default: console.log(error);
        }
      }
    );
  }

  linkWithGithub(): Promise<string> {
    const githubProvider = new auth.GithubAuthProvider();
    githubProvider.addScope('admin:hooks');
    githubProvider.addScope('repo');
    const fireUser = this.authService.getFireUser();
    return fireUser.linkWithPopup(githubProvider).then((result) => {
      const credential = result.credential;
      localStorage.setItem('github-access-token', credential[`accessToken`]);
      const user = result.user;
      const linkUser = {
        userId: this.authService.getCurrentUser().id,
        providerName: Providers.Github,
        providerUrl: credential.providerId,
        uId: user.uid
      } as LinkProvider;
      this.userService.linkProvider(linkUser)
        .subscribe((resp) => {
          if (resp) {
            this.authService.setUser(resp);
          }
        });
      return 'ok';
    }).catch((err) => {
      console.log(err);
      switch (err.code) {
        case 'auth/credential-already-in-use': {
          return 'This account is already added to BuildeR!';
        }
        default: { return err.code; }
      }
    });
  }

  linkWithGoogle(): Promise<string> {
    const googleProvider = new auth.GoogleAuthProvider();
    const fireUser = this.authService.getFireUser();
    return fireUser.linkWithPopup(googleProvider).then((result) => {
      const credential = result.credential;
      const user = result.user;
      const linkUser = {
        userId: this.authService.getCurrentUser().id,
        providerName: Providers.Google,
        providerUrl: credential.providerId,
        uId: user.uid
      } as LinkProvider;
      this.userService.linkProvider(linkUser)
        .subscribe((resp) => {
          if (resp) {
            this.authService.setUser(resp);
          }
        });
      return 'ok';
    }).catch((err) => {
      console.log(err);
      switch (err.code) {
        case 'auth/credential-already-in-use': {
          return 'This account is already added to BuildeR!';
        }
        default: return err.code;
      }
    });
  }

  login(credential: auth.UserCredential, redirectUrl?: string): void {
    this.userService.login(credential.user.uid)
      .subscribe((resp) => {
        if (resp) {
          this.authService.getAngularAuth().authState
            .subscribe((user) => {
              this.authService.configureAuthState(user);
              if (user && user.uid === resp.userSocialNetworks[0].uId) {
                this.authService.setUser(resp);
                this.router.navigate([redirectUrl ?? '/portal']);
              }
            });
        }
        else {
          this.registerDialog.signUp(credential);
        }
      });
  }
}
