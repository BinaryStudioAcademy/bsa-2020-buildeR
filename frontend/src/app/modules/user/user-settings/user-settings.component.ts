import { Component, OnInit, Input } from '@angular/core';
import { User } from '@shared/models/user/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrNotificationsService } from '../../../core/services/toastr-notifications.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {

  // hardcoded date for test

  isChanged = false;
  changedUser: User = {} as User;

  @Input() details: User = {} as User;
  public settingsForm: FormGroup;

  constructor(
    private settingsService: UserService,
    private toastrService: ToastrNotificationsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fbr: FirebaseSignInService) { }

  ngOnInit(): void {

    this.route.data.subscribe(data => this.details = data.user);
    this.settingsForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\'\\s])(?!.*--)(?!.*\'\')[[A-Za-z-\'\\s]+(?<![-\'\\s])$')
        ]),
      lastName: new FormControl(this.details.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\'\\s])(?!.*--)(?!.*\'\')[[A-Za-z-\'\\s]+(?<![-\'\\s])$')
        ]),
      avatarUrl: new FormControl(this.details.avatarUrl),
      email: new FormControl(this.details.email,
        [
          Validators.required,
          Validators.pattern('^(?![-\\.])(?!.*--)(?!.*\\.\\.)[\\w-\\.]{2,30}(?<![-\\.])@(?![-\\.])(?!.*--)(?!.*\\.\\.)[\\w-\\.]{3,30}(?<![-\\.])$')
        ]),
      location: new FormControl(this.details.location,
        [
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\'])(?!.*--)(?!.*\'\')[[A-Za-z-\'\\s,]+(?<![-\'])$')
        ]),
      username: new FormControl(this.details.username,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._]+(?<![-\\.])$')
        ]),
      bio: new FormControl(this.details.bio,
        [
          Validators.maxLength(300),
          Validators.pattern('[^А-яа-я]*')
        ])
    });

    this.settingsForm.valueChanges.subscribe(changesSettigsForm => {
      this.isChanged = false;
      this.changedUser = <User>changesSettigsForm;
      if (this.details.lastName === this.changedUser.lastName &&
        this.details.firstName === this.changedUser.firstName &&
        this.details.email === this.changedUser.email &&
        this.details.bio === this.changedUser.bio &&
        this.details.username === this.changedUser.username &&
        this.details.avatarUrl === this.changedUser.avatarUrl) {
        this.isChanged = true;
      }
    });
    this.userService.userLogoUrl.subscribe(url => this.changedUser.avatarUrl = url);
  }

  onSubmit(user: User) {
    user.id = this.details.id;
    this.userService.updateUser(user).subscribe(updateUser => {
      this.details = updateUser;
      this.isChanged = true;
      this.toastrService.showSuccess('Your profile was updated!');
      this.userService.changeImageUrl(this.settingsForm.controls.avatarUrl.value);
    }, error => {
      console.error(error);
      this.toastrService.showError('Your profile wasn\'t updated');
    });
  }

  upload() {
    if (!this.isValidUrl(this.settingsForm.controls.avatarUrl.value)) {
      this.toastrService.showError('Invalaid URL');
      return;
    }
    console.log('we here');
    this.settingsService.updateUser(this.details).subscribe((res) => {
      console.log(res);
      this.details.avatarUrl = this.settingsForm.controls.avatarUrl.value;
    },
      (err) => {
        console.log(err);
      });
  }

  private isValidUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      return false;
    }
    return true;
  }

  linkWithGithub() {
    this.fbr.linkWithGithub();
  }

  linkWithGoogle() {
    this.fbr.linkWithGoogle();
  }
}
