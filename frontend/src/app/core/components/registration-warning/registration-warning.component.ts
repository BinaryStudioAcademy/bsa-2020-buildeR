import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Providers } from '@shared/models/providers';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';

@Component({
  selector: 'app-registration-warning',
  templateUrl: './registration-warning.component.html',
  styleUrls: ['./registration-warning.component.sass']
})
export class RegistrationWarningComponent implements OnInit {

  @Input() linkProvider: Providers;
  existProvider: Providers;

  constructor(public activeModal: NgbActiveModal, private firebaseSignIn: FirebaseSignInService) { }

  ngOnInit(): void {
    switch (this.linkProvider) {
      case Providers.Github: {
        this.existProvider = Providers.Google;
        break;
      }
      case Providers.Google: {
        this.existProvider = Providers.Github;
        break;
      }
    }
  }

  getProviderValue(key: Providers) {
    return Providers[Number(key)];
  }

  signIn() {
    this.activeModal.close(this.existProvider);
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
