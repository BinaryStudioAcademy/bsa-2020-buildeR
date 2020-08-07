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

  @Input() details: User = {} as User;
  public settingsForm: FormGroup;
  constructor(settingsService: UserSettingsService) { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.required
        ]),
      lastName: new FormControl(this.details.lastName,
         [
           Validators.required
        ]),
      email: new FormControl(this.details.email,
        [
          Validators.email,
          Validators.required
        ]),
        location: new FormControl(this.details.location),
        username: new FormControl(this.details.username),
        bio : new FormControl(this.details.bio,
          [
            Validators.maxLength(200)
          ])
    });
  }

}
