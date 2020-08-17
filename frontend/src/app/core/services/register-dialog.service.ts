import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationDialogComponent } from '../components/registration-dialog/registration-dialog.component';
import { NewUser } from '../../shared/models/user/new-user';
import { Providers } from '@shared/models/providers';

@Injectable({
  providedIn: 'root'
})
export class RegisterDialogService {

  constructor(private modalService: NgbModal) { }

  openModal(user: NewUser) {
    const modalRef = this.modalService.open(RegistrationDialogComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.details = user;
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

    this.openModal(user);
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

    this.openModal(user);
  }

  signUp(auth: firebase.auth.UserCredential) {
    const provider = auth.credential.providerId;
    switch (provider) {
      case 'google.com': {
        this.doGoogleSignUp(auth);
        break;
      }
      case 'github.com': {
        this.doGithubSignUp(auth);
        break;
      }
    }
  }
}
