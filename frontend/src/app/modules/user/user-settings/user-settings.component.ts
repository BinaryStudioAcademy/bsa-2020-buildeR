import { Component, OnInit, Input } from '@angular/core';
import { User } from '@shared/models/user';
import { UserSettingsService } from '@core/services/user-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {

  isChanged: boolean = false;

  changedUser: User = {} as User;
  @Input() details: User = JSON.parse(localStorage.getItem(`user`));
  public settingsForm: FormGroup;
  constructor(settingsService: UserSettingsService) { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern("^(?![-'])(?!.*--)(?!.*'')[[A-Za-z-']+(?<![-'])$")
        ]),
      lastName: new FormControl(this.details.lastName,
         [
           Validators.required,
           Validators.minLength(1),
           Validators.maxLength(30),
           Validators.pattern("^(?![-'])(?!.*--)(?!.*'')[[A-Za-z-']+(?<![-'])$")
        ]),
      email: new FormControl(this.details.email,
        [
           Validators.required,
           Validators.pattern("^(?![-\\.])(?!.*--)(?!.*\\.\\.)[\\w-\\.]{2,30}(?<![-\\.])@(?![-\\.])(?!.*--)(?!.*\\.\\.)[\\w-\\.]{3,30}(?<![-\\.])$")
        ]),
        location: new FormControl(this.details.location,
          [
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern("^(?![-'])(?!.*--)(?!.*'')[[A-Za-z-'\\s,]+(?<![-'])$")
        ]),
        username: new FormControl(this.details.username,
          [
            Validators.minLength(3),
            Validators.maxLength(30),
            Validators.pattern("^(?![-\\.])(?!.*--)(?!.*\\.\\.)(?!.*-\\.)(?!.*\\.-)[[A-Za-z0-9-\\._]+(?<![-\\.])$")
          ]),
        bio : new FormControl(this.details.bio,
          [
            Validators.maxLength(300),
            Validators.pattern("[^А-яа-я]*")
          ])
    });

    this.settingsForm.valueChanges.subscribe(changesSettigsForm => {
      this.isChanged = false;
      this.changedUser = <User>changesSettigsForm;
      if(this.details.lastName === this.changedUser.lastName &&
        this.details.firstName === this.changedUser.firstName &&
        this.details.email === this.changedUser.email &&
        this.details.bio === this.changedUser.bio &&
        this.details.username === this.changedUser.username) {
        this.isChanged = true;
      }
      console.log(this.isChanged)
      console.log(this.details)
      console.log(this.changedUser)
    })
  }

  onSubmit(user: User) {

    alert("userName: " + user.firstName + "\n" +
          "lastName: " + user.lastName + "\n" +
          "user Name: " + user.username + "\n" +
          "email: " + user.email + "\n" +
          "location: " + user.location);
    this.details = user;
  }

}
