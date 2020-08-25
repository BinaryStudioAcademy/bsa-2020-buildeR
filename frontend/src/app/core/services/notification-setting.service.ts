import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NotificationSetting } from '../../shared/models/notification-setting/notification-setting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationSettingService {
  public routePrefix = '/notificationSettings';

  constructor(private httpService: HttpService) {}

  public getNotificationSettingByUserId(userId: number): Observable<NotificationSetting> {
    return this.httpService.getRequest<NotificationSetting>(`${this.routePrefix}/GetByUserId/${userId}`);
  }
  public updateNotificationSettings(settings: NotificationSetting): Observable<NotificationSetting> {
    return this.httpService.putRequest<NotificationSetting>(`${this.routePrefix}`, settings);
  }
}
