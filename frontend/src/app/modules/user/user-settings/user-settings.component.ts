import { Component, OnInit, Input } from '@angular/core';
import { User } from '@shared/models/user';
import { UserSettingsService } from '@core/services/user-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ToastrNotificationsService} from "../../../core/services/toastr-notifications.service";
import {UserService} from "../../../core/services/user.service";
import {takeUntil} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {

  isChanged: boolean = false;
  changedUser: User = {} as User;
  @Input() details: User = {} as User;

  public settingsForm: FormGroup;

  constructor(private settingsService: UserSettingsService,
              private toastrService: ToastrNotificationsService,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.data.subscribe( data => this.details = data.user);
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
            Validators.required,
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
    });
  }

  onSubmit(user: User) {
    this.isChanged = true;
    this.toastrService.showSuccess('Your profile was updated!');
    this.details = user;
  }

}
