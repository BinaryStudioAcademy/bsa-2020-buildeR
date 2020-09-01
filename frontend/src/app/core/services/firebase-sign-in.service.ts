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
import { User } from '@shared/models/user/user';
import { EmailVerificationModalComponent } from '@core/components/email-verification-modal/email-verification-modal.component';
import { UserSocialNetwork } from '@shared/models/user/user-social-network';

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
      (error: auth.Error) => {
        this.openSignInWarning(error, Providers.Github);
      }
    );
  }

  signInWithGoogle(redirectUrl?: string) {
    const googleProvider = new auth.GoogleAuthProvider();
    return this.authService.getAngularAuth().signInWithPopup(googleProvider).then(
      (credential) => {
        this.login(credential, redirectUrl);
      },
      (error: auth.Error) => {
        this.openSignInWarning(error, Providers.Google);
      }
    );
  }

  // async linkWithGithub(): Promise<string> {
  //   try {
  //     return this.linkWithProvider(Providers.Github);
  //   }
  //   catch (err) {
  //     console.log(err);
  //     switch (err.code) {
  //       case 'auth/credential-already-in-use': {
  //         return 'This account is already added to BuildeR!';
  //       }
  //       default: { return err.code; }
  //     }
  //   }
  // }

  // async linkWithGoogle(): Promise<string> {
  //   try {
  //     return this.linkWithProvider(Providers.Google);
  //   }
  //   catch (err) {
  //     console.log(err);
  //     switch (err.code) {
  //       case 'auth/credential-already-in-use': {
  //         return 'This account is already added to BuildeR!';
  //       }
  //       default: return err.code;
  //     }
  //   }
  // }

  login(credential: auth.UserCredential, redirectUrl?: string): void {
    this.userService.login(credential.user.uid)
      .subscribe((resp) => {
        if (!credential.user.emailVerified) {
          credential.user.sendEmailVerification().then(() => {
            this.openVerificationEmailModal(credential.user.email);
          });
          return;
        }
        if (resp) {
          if (credential.credential.providerId === 'google.com') {
            if (!this.isProviderAdded(resp, Providers.Google)) {
              this.linkUserGoogleAdditional(resp, credential);
            }
          }

          this.authService.getAngularAuth().authState
            .subscribe((user) => {
              if (!user?.emailVerified) {
                user?.sendEmailVerification().then(() => {
                  this.openVerificationEmailModal(credential.user.email);
                });
              }
              else {
                this.giveAccessToUser(resp, user, redirectUrl);
                // this.giveAccessToUser(resp, this.authService.getFireUser(), redirectUrl);
              }
            });
        }
        else {
          this.registerDialog.signUp(credential);
        }
      });
  }

  giveAccessToUser(resp: User, user: firebase.User, redirectUrl?: string) {
    this.authService.configureAuthState(user);
    if (user && user.uid === resp.userSocialNetworks[0].uId) {
      this.authService.setUser(resp);
      this.router.navigate([redirectUrl ?? '/portal']);
    }
  }

  openVerificationEmailModal(email: string) {
    const modalRef = this.modalService.open(EmailVerificationModalComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.email = email;
  }

  openSignInWarning(error: auth.Error, provider: Providers) {
    switch (error.code) {
      case 'auth/account-exists-with-different-credential': {
        const modalRef = this.modalService.open(RegistrationWarningComponent, { backdrop: 'static', keyboard: false });
        modalRef.componentInstance.linkProvider = provider;
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

  isProviderAdded(user: User, provider: Providers) {
    if (user.userSocialNetworks === null) {
      return true;
    }
    const check = (item: UserSocialNetwork) => item.providerName === provider;
    return user.userSocialNetworks?.some(check);
  }

  linkUserGoogleAdditional(user: User, credential: auth.UserCredential) {
    const linkUser = ({
      userId: user.id,
      providerName: Providers.Google,
      providerUrl: credential.credential.providerId,
      uId: credential.user.uid
    } as LinkProvider);
    this.userService.linkProvider(linkUser)
      .subscribe((response) => {
        if (response) {
          this.authService.setUser(response);
          user = response;
        }
      });
  }

  async linkWithProvider(provider: Providers) {
    try {
      const fireProvider = this.setFirebaseProvider(provider);

      const result = await (await this.authService.getAngularAuth().currentUser).linkWithPopup(fireProvider);
      const credential = result.credential;
      const user = result.user;
      this.authService.setFirebaseUser(user);
      const linkUser = ({
        userId: this.authService.getCurrentUser().id,
        providerName: provider,
        providerUrl: credential.providerId,
        uId: user.uid
      } as LinkProvider);

      this.userService.linkProvider(linkUser)
        .subscribe((resp) => {
          if (resp) {
            this.authService.setUser(resp);
          }
        });
      return 'ok';
    }
    catch (err) {
      console.log(err);
      switch (err.code) {
        case 'auth/credential-already-in-use': {
          return 'This account is already added to BuildeR!';
        }
        default: return err.code;
      }
    }
  }

  setFirebaseProvider(provider: Providers) {
    let fireProvider;
    switch (provider) {
      case Providers.Google: {
        fireProvider = new auth.GoogleAuthProvider();
        break;
      }
      case Providers.Github: {
        fireProvider = new auth.GithubAuthProvider();
        fireProvider.addScope('admin:hooks');
        fireProvider.addScope('repo');
        break;
      }
    }
    return fireProvider;
  }

  async linkGithubOnlyInFirebase() {
    const githubProvider = new auth.GithubAuthProvider();
    githubProvider.addScope('admin:hooks');
    githubProvider.addScope('repo');
    try {
      const result = await (await this.authService.getAngularAuth().currentUser).linkWithPopup(githubProvider);
      const credential = result.credential;
      this.authService.setFirebaseUser(result.user);
      localStorage.setItem('github-access-token', credential[`accessToken`]);
      return 'ok';
    }
    catch (err) {
      console.log(err);
      switch (err.code) {
        case 'auth/credential-already-in-use': {
          return 'This account is already added to BuildeR!';
        }
        default: { return err.code; }
      }
    }
  }
}
