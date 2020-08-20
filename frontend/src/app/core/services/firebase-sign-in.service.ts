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
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSignInService {

  private unsubscribe$ = new Subject<void>();

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
          this.authService.getAngularAuth().authState
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((user) => {
              this.authService.configureAuthState(user);
              if (user) {
                if (user.uid === resp.userSocialNetworks[0].uId) {
                  this.authService.setUser(resp);
                  this.router.navigate([redirectUrl ?? '/portal']);
                }
              }
            });
        }
        else {
          this.registerDialog.signUp(credential);
        }
      });
  }
}
