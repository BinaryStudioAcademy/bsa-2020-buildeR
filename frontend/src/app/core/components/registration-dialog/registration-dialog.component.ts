import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@core/services/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUser } from '@shared/models/user/new-user';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.sass']
})
export class RegistrationDialogComponent implements OnInit {

  @Input() details: NewUser = {} as NewUser;
  @Input() isUsernameTaken = false;
  public registerForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern(`^(?![-'\\s])(?!.*'')[[A-Za-z\\s-']+(?<![-'\\s])$`)
        ]),
      lastName: new FormControl(this.details.lastName,
        [
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern(`^(?![-'\\s])(?!.*'')[[A-Za-z\\s-']+(?<![-'\\s])$`)
        ]),
      email: new FormControl(this.details.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`^[a-zA-Z].*`)
        ]),
      username: new FormControl(this.details.username,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(`^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._]+(?<![-\\.])$`)
        ]),
    });
  }

  save() {
    const fName = this.registerForm.value[`firstName`];
    if (fName === '') {
      this.details.firstName = null;
    }
    else {
      this.details.firstName = this.registerForm.value[`firstName`];
    }
    const lName = this.registerForm.value[`lastName`];
    if (lName === '') {
      this.details.lastName = null;
    }
    else {
      this.details.lastName = this.registerForm.value[`lastName`];
    }

    this.details.username = this.registerForm.value[`username`];
    this.details.email = this.registerForm.value[`email`];
    this.authService.registerUser(this.details);
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.close();
    this.authService.cancelRegistration();
  }

}
