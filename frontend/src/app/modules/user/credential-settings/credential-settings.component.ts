import { Component, OnInit } from '@angular/core';
import { Credentials } from '@core/models/Credentials';
import { SynchronizationService } from '@core/services/synchronization.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { userCredentialsAsyncValidator } from '@core/validators/user-credentials.async-validator';

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
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.syncService.getUserCredentials(this.user.id)
      .subscribe(credentials => {
        this.credentialsForm.controls['username'].setValue(credentials.username);
        this.credentialsForm.controls['password'].setValue(credentials.password);
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

    // this.syncService.setUpCredentials(this.user.id, this.credentials)
    //   .subscribe(() => this.credentials);
    console.log(this.credentialsForm);
  }
}
