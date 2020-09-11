import { Component, OnInit } from '@angular/core';
import { NotificationSetting } from 'src/app/shared/models/notification-setting/notification-setting';
import { NotificationDescription } from 'src/app/shared/models/notification-setting/notification-description';
import { NotificationType } from '@shared/models/notification-type';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { NotificationSettingService } from '@core/services/notification-setting.service';
import { map, takeUntil } from 'rxjs/operators';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.sass']
})
export class NotificationSettingComponent extends BaseComponent implements OnInit {

  isShowSpinner = false;
  user: User = this.authService.getCurrentUser();
  setting: NotificationSetting = {} as NotificationSetting;
  descriptions: NotificationDescription[] =
    [
      { notificationType: NotificationType.BuildSucceeded, description: 'When build of project was successful' },
      { notificationType: NotificationType.BuildFailed, description: 'When build of project was failed' },
      { notificationType: NotificationType.BuildErrored, description: 'When build of project was errored' },
      { notificationType: NotificationType.BuildCanceled, description: 'When build of project was canceled' },
    ];
  constructor(
    private settingService: NotificationSettingService,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getSettings(this.user.id);
  }

  getSettings(userId: number) {
    this.settingService.getNotificationSettingByUserId(userId)
      .pipe(
        map(setting => {
          setting.notificationSettingOptions.map(option => {
            option.description = this.descriptions.find(d => d.notificationType === option.notificationType)?.description
              ?? NotificationType[option.notificationType].toString();
            return option;
          });
          return setting;
        }),
        takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => this.setting = data,
        (error) => this.toastrService.showError(error.message, error.name)
      );
  }

  onToggle(change: boolean) {
    change = !change;
  }

  save() {
    this.isShowSpinner = true;
    let res = true;
    if (res) {
      res = false;
      this.settingService.updateNotificationSettings(this.setting)
        .pipe(
          map(setting => {
            setting.notificationSettingOptions.map(option => {
              option.description = this.descriptions.find(d => d.notificationType === option.notificationType)?.description
                ?? NotificationType[option.notificationType].toString();
              return option;
            });
            return setting;
          }), takeUntil(this.unsubscribe$))
        .subscribe(
          (data) => {
            this.setting = data;
            this.isShowSpinner = false;
            this.toastrService.showSuccess('Notification settings have been successfully updated');
            res = true;
          },
          (error) => {
            this.isShowSpinner = false;
            this.toastrService.showError(error.message, error.name);
            res = true;
          }
        );
    }
  }
}
