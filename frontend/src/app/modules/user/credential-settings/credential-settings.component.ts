import { Component, OnInit } from '@angular/core';
import { SynchronizationService } from '@core/services/synchronization.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { AccessToken } from '@core/models/AccessToken';
import { userCredentialsAsyncValidator } from '@core/validators/user-credentials.async-validator';

@Component({
  selector: 'app-credential-settings',
  templateUrl: './credential-settings.component.html',
  styleUrls: ['./credential-settings.component.sass']
})
export class CredentialSettingsComponent implements OnInit {

  user = this.authService.getCurrentUser();
  token = {} as AccessToken;
  tokenForm: FormGroup;

  constructor(
    private syncService: SynchronizationService,
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService
  ) { }

  ngOnInit(): void {
    this.tokenForm = new FormGroup({
      token: new FormControl(this.token.token, [
        Validators.required
      ])
    }, {
      asyncValidators: userCredentialsAsyncValidator(this.syncService)
    });

    this.syncService.getUserAccessToken(this.user.id)
      .subscribe(accesToken => {
        this.tokenForm.controls.token.setValue(accesToken.token);
      });
  }

  saveCredentials() {
    this.syncService.setUpUserToken(this.user.id, this.tokenForm.value as AccessToken)
      .subscribe(() => this.toastrService.showSuccess('Your token was saved!'),
        error => this.toastrService.showError('Something went wrong'));
  }
}
