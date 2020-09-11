import { Component, OnInit } from '@angular/core';
import { SynchronizationService } from '@core/services/synchronization.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { AccessToken } from '@core/models/AccessToken';
import { userCredentialsAsyncValidator } from '@core/validators/user-credentials.async-validator';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-credential-settings',
  templateUrl: './credential-settings.component.html',
  styleUrls: ['./credential-settings.component.sass']
})
export class CredentialSettingsComponent extends BaseComponent implements OnInit {

  user = this.authService.getCurrentUser();
  token = {} as AccessToken;
  tokenForm: FormGroup;

  constructor(
    private syncService: SynchronizationService,
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.tokenForm = new FormGroup({
      token: new FormControl(this.token.token, [
        Validators.required
      ])
    }, {
      asyncValidators: userCredentialsAsyncValidator(this.syncService)
    });

    this.syncService.getUserAccessToken(this.user.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(accesToken => {
        this.tokenForm.controls.token.setValue(accesToken.token);
      });
  }

  saveCredentials() {
    this.syncService.setUpUserToken(this.user.id, this.tokenForm.value as AccessToken)
      .subscribe(() => this.toastrService.showSuccess('Your token was saved!'),
        err => this.toastrService.showError(err.error, err.name));
  }
}
