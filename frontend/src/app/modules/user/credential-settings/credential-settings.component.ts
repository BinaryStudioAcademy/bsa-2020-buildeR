import { Component, OnInit } from '@angular/core';
import { Credentials } from '@core/models/Credentials';
import { SynchronizationService } from '@core/services/synchronization.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { userCredentialsAsyncValidator } from '@core/validators/user-credentials.async-validator';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-credential-settings',
  templateUrl: './credential-settings.component.html',
  styleUrls: ['./credential-settings.component.sass']
})
export class CredentialSettingsComponent implements OnInit {

  user = this.authService.getCurrentUser();
  credentials = {} as Credentials;
  credentialsForm: FormGroup;

  constructor(private syncService: SynchronizationService,
              private authService: AuthenticationService,
              private toastrService: ToastrNotificationsService) { }

  ngOnInit(): void {
    this.syncService.getUsernameFromCredentials(this.user.id)
      .subscribe(credentials => {
        this.credentialsForm.controls.username.setValue(credentials.username);
      });

    this.credentialsForm = new FormGroup({
      username: new FormControl(this.credentials.username, [
        Validators.required
      ]),
      password: new FormControl(this.credentials.password, [
        Validators.required
      ]),
    }, {
      asyncValidators: userCredentialsAsyncValidator(this.syncService)
    });
  }

  saveCredentials() {
    this.syncService.setUpCredentials(this.user.id, this.credentialsForm.value as Credentials)
      .subscribe(() => this.toastrService.showSuccess('Your cedentials saved!'),
                 error => this.toastrService.showError('Something went wrong'));
  }
}
