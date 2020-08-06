import { Component, OnInit, Input } from '@angular/core';
import { UserSettings } from '../../../models/user-settings';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSettingsService } from '../../../services/user-settings.service';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {
  @Input() details: UserSettings = {} as UserSettings;
  public settingsForm: FormGroup;
  constructor(settingsService: UserSettingsService) { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      'name': new FormControl(this.details.name,
        [
          Validators.required
        ]),
      'email': new FormControl(this.details.email,
        [
          Validators.email,
          Validators.required
        ]),
        'location': new FormControl(this.details.location),
        'website': new FormControl(this.details.website),
        'bio' : new FormControl(this.details.bio,
          [
            Validators.maxLength(200)
          ])
    });
  }



}
