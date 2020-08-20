import { Component, OnInit } from '@angular/core';
import { NotificationSetting } from 'src/app/shared/models/notification-setting/notification-setting';
import { NotificationDescription } from 'src/app/shared/models/notification-setting/notification-description';
import { NotificationSettingType } from '@shared/models/notification-setting/notification-setting-type';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { NotificationSettingService } from '@core/services/notification-setting.service';
import { map } from 'rxjs/operators';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.sass']
})
export class NotificationSettingComponent implements OnInit {

  appChecked = false;
  emailChecked = false;
  user: User = this.authService.getCurrentUser();
  settings: NotificationSetting [] = [];
  descriptions: NotificationDescription [] =
  [
    { notificationType: NotificationSettingType.buildSuccess,  description: 'When build of project was successful'},
    { notificationType: NotificationSettingType.buildFailed, description: 'When build of project was was failed'},
  ];
  constructor(
    private settingService: NotificationSettingService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    ) { }

  ngOnInit(): void {
    this.getSettings(this.user.id);
  }
  getSettings(userId: number) {
    this.settingService.getNotificationSettingByUserId(userId)
    .pipe(
      map(x =>
        {
          x.map(des =>
            {
              des.description = this.descriptions.find(d => d.notificationType === des.notificationType).description;
              return des;
            });
          return x;
        } ))
    .subscribe(
      (data) => this.settings = data,
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  onToggle(change: boolean) {
    change = !change;
  }

  save() {
    this.settingService.updateNotificationSettings(this.settings)
      .subscribe(
        () => this.toastrService.showSuccess('notification settings updated'),
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }
}
