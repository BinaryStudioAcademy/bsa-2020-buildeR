import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NotificationSetting } from '../../shared/models/notification-setting/notification-setting';

@Injectable({
  providedIn: 'root'
})
export class NotificationSettingService {
  private routePrefix = '/notificationSettings';

  constructor(private httpService: HttpService) {}

  getNotificationSettingByUserId(userId: number) {
    return this.httpService.getRequest<NotificationSetting>(`${this.routePrefix}/GetByUserId/${userId}`);
  }

  updateNotificationSettings(settings: NotificationSetting) {
    return this.httpService.putRequest<NotificationSetting>(`${this.routePrefix}`, settings);
  }
}
