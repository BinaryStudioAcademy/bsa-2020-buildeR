import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { User } from '@shared/models/user';
import { UserSettingsService } from '@core/services/user-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrNotificationsService } from '../../../core/services/toastr-notifications.service';
import { environment } from '@env/environment';
import { AuthenticationService } from '@core/services/authentication.service';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {

  details: User = {} as User;
  public serverUrl: string;
  public settingsForm: FormGroup;
  public formData: FormData;
  @ViewChild('file', {static : false}) imageInput: ElementRef;
  constructor(
    private settingsService: UserSettingsService,
    private toastrNotification: ToastrNotificationsService,
    private authService: AuthenticationService) { }

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
    this.details = this.authService.getUser();
    this.serverUrl = environment.apiUrl + '/api/FileStorage/download/?filePath=' + this.details.avatarUrl;
  }

  public upload(event: any): void {
    const file = event.target.files[0];
    this.formData = new FormData();
    this.formData.append('file', file, file.name);
    this.settingsService.uploadImage(this.formData)
    .subscribe(response =>
    {
      this.toastrNotification.showSuccess('Img uploaded to server');
      this.changeAvatar(response);
    },
    (error) => this.toastrNotification.showError('Something went wrong. Please try later'));
  }

  public changeAvatar(filePath: string){
    this.serverUrl = environment.apiUrl + '/api/FileStorage/download/?filePath=' + filePath;
    this.details.avatarUrl = filePath;
    this.settingsService.updateSettings(this.details)// update user relative path in database
    .subscribe(user => {
      this.toastrNotification.showSuccess('User image updated');
      this.authService.setUser(user);
    });
    this.imageInput.nativeElement.value = '';
  }
}
