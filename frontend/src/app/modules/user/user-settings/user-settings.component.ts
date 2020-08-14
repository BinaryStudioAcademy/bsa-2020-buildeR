import { Component, OnInit, Input } from '@angular/core';
import { User } from '@shared/models/user/user';
import { UserSettingsService } from '@core/services/user-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalCropperService } from '@core/services/modal-cropper.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {
// hardcoded date for test
  @Input() details: User = {} as User;
  public settingsForm: FormGroup;

  constructor(private settingsService: UserSettingsService, private cropper: ModalCropperService,
              private toastr: ToastrNotificationsService) { }

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
        avatarUrl: new FormControl(this.details.avatarUrl),
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

  async open(){
    const file = await this.cropper.open();
    if (file){
      console.log('we have cropped ' + typeof(file));
      // now we can use it for saving image logic
    }
    else{
      console.log('Image didn`t change');
    }
  }
  upload(){
    if (!this.isValidUrl(this.settingsForm.controls.avatarUrl.value)){
    this.toastr.showError('Invalid URL');
    this.settingsForm.controls.avatarUrl.setValue('');
    return;
    }
    this.details.avatarUrl = this.settingsForm.controls.avatarUrl.value;
    this.settingsService.updateSettings(this.details).subscribe((res) =>
    console.log('success'),
    (err) => console.log(err));
  }

  private isValidUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      return false;
    }
    return true;
  }
}
