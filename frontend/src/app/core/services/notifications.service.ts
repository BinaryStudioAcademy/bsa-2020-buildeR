import { Injectable, OnDestroy } from '@angular/core';
import { SignalRHub } from '@core/models/signalr-hub';
import { AuthenticationService } from '@core/services/authentication.service';
import { SignalRHubFactoryService } from '@core/services/signalr-hub-factory.service';
import { Notification } from '@shared/models/notification';
import { User } from '@shared/models/user/user';
import { Subject } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { AppNotificationsToasterService } from './app-notifications-toaster.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnDestroy {
  private routePrefix = '/notifications';

  private notificationsHub: SignalRHub;
  private notifications$ = new Subject<Notification>();
  private currentUser: User;

  constructor(
    private signalRService: SignalRHubFactoryService,
    private authService: AuthenticationService,
    private httpService: HttpService,
    private appNotificationsToaster: AppNotificationsToasterService
  ) {

  }

  private getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  connect() {
    this.getCurrentUser();
    this.configureSignalR();
  }

  getNotifications() {
    this.getCurrentUser();
    return this.httpService.getRequest<Notification[]>(
      `${this.routePrefix}/user/${this.currentUser.id}`);
  }

  markAsRead(notificationId: number) {
    this.httpService.postRequest(
      `${this.routePrefix}/markAsRead/${notificationId}`,
      null
    ).subscribe(null);
  }

  ngOnDestroy() {
    this.notificationsHub.disconnect();
    this.notifications$.unsubscribe();
  }

  private configureSignalR() {
    this.notificationsHub = this.signalRService.createHub('/notificationshub');
    this.notificationsHub
      .start()
      .then(() => {
        this.notificationsHub
          .invoke('JoinGroup', this.currentUser.id.toString())
          .then(null)
          .catch((err) => {});
      })
      .catch((err) => {});
    this.notificationsHub.listen('getNotification').subscribe((notif) => {
      const notification: Notification = JSON.parse(notif);
      notification.date = new Date();
      this.notifications$.next(notification);
      this.appNotificationsToaster.show(notification);
    });
  }

  listen() {
    return this.notifications$;
  }
}
