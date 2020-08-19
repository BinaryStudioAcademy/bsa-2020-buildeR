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
        // localStorage.setItem('github-access-token', credential.credential[`accessToken`]);
        this.login(credential, redirectUrl);
      },
      (error) => {
        const modalRef = this.modalService.open(RegistrationWarningComponent, { backdrop: 'static', keyboard: false });
        modalRef.componentInstance.provider = Providers.Github;
      }
    );
  }

  signInWithGoogle(redirectUrl?: string) {
    const googleProvider = new auth.GoogleAuthProvider();
    // this.angularAuth.signInWithRedirect(googleProvider);
    // this.angularAuth.getRedirectResult().then((result) => {
    //   if (result) {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     this.login(result, redirectUrl);
    //     // ...
    //   }
    //   // The signed-in user info.
    //   //var user = result.user;
    // }).catch((error) => {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });
    return this.authService.getAngularAuth().signInWithPopup(googleProvider).then((credential) => {
      this.login(credential, redirectUrl);
    },
      (error) => {
        const modalRef = this.modalService.open(RegistrationWarningComponent, { backdrop: 'static', keyboard: false });
        modalRef.componentInstance.provider = Providers.Google;
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
              if (user.uid === resp.userSocialNetworks[0].uId) {
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
