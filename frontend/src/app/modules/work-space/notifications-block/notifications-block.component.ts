import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../shared/models/notification';
import { NotificationType } from '../../../shared/models/notification-type';
import { NotificationsService } from '@core/services/notifications.service';

@Component({
  selector: 'app-notifications-block',
  templateUrl: './notifications-block.component.html',
  styleUrls: ['./notifications-block.component.sass'],
})
export class NotificationsBlockComponent implements OnInit {
  public notifications: Notification[] = [];
  public NotificationType = NotificationType;
  public showAllNotifications = false;
  public isShowingRead = false;
  public counter: number;
  @Output() counterNotifications = new EventEmitter<number>();
  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(private notificationService: NotificationsService) {}

  ngOnInit(): void {
    this.notificationService.listen()
    .subscribe((notification) => {
      this.notifications.push(notification);
      this.onChanging("adding", notification);
    });
  }

  clearOne(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
    notification.isRead = true;
    this.onChanging("reading", notification);
  }

  clearAll() {
    this.notifications.forEach((notification) => {
      this.clearOne(notification);
    });
  }

  toggle() {
    this.toggleNotifications.emit();
  }

  onChanging(type: "adding" | "reading", notification: Notification) {
    if (type == "adding") {
      if (this.isShowingRead || !notification.isRead) {
        this.counterNotifications.emit(1);
      }
    } else {
      if (!this.isShowingRead) {
        this.counterNotifications.emit(-1);
      }
    }
  }
}
