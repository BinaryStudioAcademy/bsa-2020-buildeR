import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../shared/models/notification';
import { NotificationType } from '../../../shared/models/notification-type';
import { NotificationsService } from '@core/services/notifications.service';
import { BuildStatus } from '@shared/models/build-status';

@Component({
  selector: 'app-notifications-block',
  templateUrl: './notifications-block.component.html',
  styleUrls: ['./notifications-block.component.sass'],
})
export class NotificationsBlockComponent implements OnInit {
  public notifications: Notification[] = [];
  public cachedNotifications: Notification[] = [];
  public NotificationType = NotificationType;
  public showAllNotifications = false;
  public showRead = false;
  public counter: number;
  @Output() counterNotifications = new EventEmitter<number>();
  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(
    private notificationService: NotificationsService
  ) {
    this.onCountChange();
  }

  ngOnInit(): void {
    this.notificationService.listen()
    .subscribe(
      (notification) => this.notifications.push(notification)
    )
  }

  // Change type of notification to read, push it into array of read notifications and delete from general array
  clearOne(notification: Notification) {
    notification.isRead = true;
    this.onCountChange();
  }
  onCountChange() {
    this.counter = this.notifications?.filter(
      (x) => x.isRead === false
    )?.length;
    this.counterNotifications.emit(this.counter);
  }
  // Change type of all notifications to read, push them inro  array of read notifications and delete from general array
  clearAll() {
    this.notifications.forEach((notification) => {
      notification.isRead = true;
    });
    this.cachedNotifications = this.notifications;
    this.onCountChange();
  }

  toggle() {
    this.onCountChange();
    this.toggleNotifications.emit();
  }

  // First 2 notifications with different types (can be more types: just need to add class to styles)
  showAll() {
    this.cachedNotifications = this.notifications;
    this.showAllNotifications = true;
  }
}
