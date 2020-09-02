import { Injectable, OnDestroy} from '@angular/core';
import { SignalRHubFactoryService } from '@core/services/signalr-hub-factory.service';
import { SignalRHub } from '@core/models/signalr-hub';
import { Subject } from 'rxjs';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { HttpService } from '../../core/services/http.service';
import { Notification } from '@shared/models/notification'

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnDestroy {

  private buildStatusesHub: SignalRHub;
  private notifications = new Subject<Notification>();

  private currentUser: User;

  constructor(
    private signalRService: SignalRHubFactoryService,
    private authService: AuthenticationService,
    private httpService: HttpService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    httpService.getRequest<Notification[]>(`/notifications/user/${this.currentUser.id}`)
      .subscribe(
        (notifications) => this.notifications.next(...notifications)
      )
    this.configureSignalR();
  }

  ngOnDestroy() {
    this.buildStatusesHub.disconnect();
  }

  private configureSignalR() {
    this.buildStatusesHub = this.signalRService.createHub('/notificationshub');
    this.buildStatusesHub
      .start()
      .then(() => {
        this.buildStatusesHub
          .invoke('JoinGroup', this.currentUser.id.toString())
          .then(null)
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
    this.buildStatusesHub.listen('getNotifications').subscribe((notif) => {
      console.log(notif);
      const notification: Notification = JSON.parse(notif);
      notification.date = new Date();
      this.notifications.next(notification);
    });
  }

  listen() {
    return this.notifications;
  }
}
