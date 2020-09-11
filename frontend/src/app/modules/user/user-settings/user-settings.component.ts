import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { FirebaseSignInService } from '@core/services/firebase-sign-in.service';
import { ModalCropperService } from '@core/services/modal-cropper.service';
import { emailDotValidator } from '@core/validators/email-dot-validator';
import { Providers } from '@shared/models/providers';
import { User } from '@shared/models/user/user';
import { UserSocialNetwork } from '@shared/models/user/user-social-network';
import { ToastrNotificationsService } from '../../../core/services/toastr-notifications.service';
import { UserService } from '../../../core/services/user.service';
import { usernameAsyncValidator } from '../../../core/validators/custom-async-validator';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {
  isChanged = false;
  changedUser: User = {} as User;
  isShowSpinner = false;

  @Input() details: User = {} as User;
  settingsForm: FormGroup;
  googleClick = false;
  githubClick = false;
  isOwner = false;
  @Output() image: EventEmitter<File> = new EventEmitter<File>();

  constructor(
    private toastrService: ToastrNotificationsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fbr: FirebaseSignInService,
    private authService: AuthenticationService,
    private cropper: ModalCropperService) { }

  ngOnInit(): void {
    this.route.parent.data.subscribe(({ user }) => {
      this.details = user;
      if (this.details.id === this.authService.getCurrentUser().id) {
        this.isOwner = true;
      }
    });
    this.settingsForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\'\\s])(?!.*--)(?!.*\'\')[[A-Za-z-\'\\s]+(?<![-\'\\s])$')
        ]),
      lastName: new FormControl(this.details.lastName,
        [
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\'\\s])(?!.*--)(?!.*\'\')[[A-Za-z-\'\\s]+(?<![-\'\\s])$')
        ]),
      avatarUrl: new FormControl(this.details.avatarUrl),
      email: new FormControl(this.details.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(`^[a-zA-Z].*`),
          emailDotValidator()
        ]),
      username: new FormControl(this.details.username,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^(?![-\\.])(?!.*--)(?!.*\\.\\.)[[A-Za-z0-9-\\._]+(?<![-\\.])$')
        ],
        [
          usernameAsyncValidator(this.userService, this.details.id)
        ]
      ),
      bio: new FormControl(this.details.bio,
        [
          Validators.maxLength(300),
          Validators.pattern('[^А-яа-я]*')
        ])
    });

    this.settingsForm.valueChanges.subscribe(changesSettigsForm => {
      this.isChanged = false;
      this.changedUser = (changesSettigsForm as User);
      if (this.details.lastName === this.changedUser.lastName &&
        this.details.firstName === this.changedUser.firstName &&
        this.details.email === this.changedUser.email &&
        this.details.bio === this.changedUser.bio &&
        this.details.username === this.changedUser.username &&
        this.details.avatarUrl === this.changedUser.avatarUrl) {
        this.isChanged = true;
      }
    });

    this.userService.userLogoUrl.subscribe(url => {
      this.details.avatarUrl = url;
    });
  }

  onSubmit(user: User) {
    this.isShowSpinner = true;
    user.id = this.details.id;
    user.role = this.details.role;
    user.createdAt = this.details.createdAt;
    if (!user.firstName) {
      user.firstName = null;
    }
    if (!user.lastName) {
      user.lastName = null;
    }
    this.userService.updateUser(user).subscribe(updateUser => {
      this.details = updateUser;
      this.isChanged = true;
      this.userService.changeUserName(this.settingsForm.controls.username.value);
      this.isShowSpinner = false;
      this.toastrService.showSuccess('Your profile was updated!');
    }, error => {
      this.isShowSpinner = false;
      this.toastrService.showError('Your profile wasn\'t updated');
    });
  }

  async upload() {
    if (!this.isValidUrl(this.settingsForm.controls.avatarUrl.value)) {
      this.toastrService.showError('Invalaid URL');
      return;
    }
    const file = await this.cropper.open(this.settingsForm.controls.avatarUrl.value);
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.userService.uploadAvatar(formData, this.details.id).subscribe((res) => {
        this.details.avatarUrl = res.avatarUrl;
        this.userService.changeImageUrl(res.avatarUrl);
        this.details.avatarUrl = res.avatarUrl;
      });
    }
  }


  private isValidUrl(url: string) {
    try {
      // tslint:disable-next-line: no-unused-expression
      new URL(url);
    } catch (_) {
      return false;
    }
    return true;
  }

  linkWithGithub() {
    const isGithubAddedInFirebase = this.isGithubAddedInFirebase();
    const isGithubAddedDb = this.isProviderAdded(Providers.Github);
    if (!isGithubAddedInFirebase && !isGithubAddedDb) {
      this.fbr.linkWithProvider(Providers.Github).then((result) => {
        if (result === 'ok') {
          this.githubClick = true;
        }
        this.showLinkMessage(result, 'Github');
      });
    } else if (!isGithubAddedInFirebase && isGithubAddedDb) {
      this.fbr.linkGithubOnlyInFirebase().then((result) => {
        this.showLinkMessage(result, 'Github');
      });
    }
  }

  linkWithGoogle() {
    this.fbr.linkWithProvider(Providers.Google).then((result) => {
      if (result === 'ok') {
        this.googleClick = true;
      }
      this.showLinkMessage(result, 'Google');
    });
  }

  showLinkMessage(result: string, provider: string) {
    if (result === 'ok') {
      this.toastrService.showSuccess(provider + ' account is successfully added!');
    }
    else {
      this.toastrService.showError(result);
    }
  }

  isProviderAdded(provider: Providers) {
    const check = (item: UserSocialNetwork) => item.providerName === provider;
    return this.details.userSocialNetworks.some(check);
  }

  isGithubAddedInFirebase() {
    return this.authService.isProviderAddedInFirebase(Providers.Github);
  }
}
