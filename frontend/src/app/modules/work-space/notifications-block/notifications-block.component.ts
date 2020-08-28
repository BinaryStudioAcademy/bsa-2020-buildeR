import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../../shared/models/notification';
import { NotificationType } from '../../../shared/models/notification-type';

@Component({
  selector: 'app-notifications-block',
  templateUrl: './notifications-block.component.html',
  styleUrls: ['./notifications-block.component.sass']
})
export class NotificationsBlockComponent implements OnInit {
  public notifications: Notification[];
  public cashedNotifications: Notification[] = [];
  public NotificationType = NotificationType;
  public showAllNotifications = false;
  public showRead = false;
  public counter: number;
  @Output() counterNotifications = new EventEmitter<number>();
  @Output() toggleNotifications = new EventEmitter<void>();


  constructor() {
    this.seed();
    this.addOnInterval();
    this.onCountChange();
  }

  ngOnInit(): void {
    this.cashedNotifications = this.lastThreeNotifications(this.notifications);
  }

   // Change type of notification to read, push it into array of read notifications and delete from general array
   clearOne(notification: Notification) {
    notification.isRead = true;
    this.cashedNotifications = this.lastThreeNotifications(this.notifications.filter(x => x.isRead === false));
    this.onCountChange();
  }
  onCountChange() {
    this.counter = this.notifications?.filter(x => x.isRead === false)?.length;
    this.counterNotifications.emit(this.counter);
  }
  // Change type of all notifications to read, push them inro  array of read notifications and delete from general array
  clearAll() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.cashedNotifications = this.notifications;
    this.onCountChange();
  }

  toggle() {
    this.onCountChange();
    this.toggleNotifications.emit();
  }

  // First 2 notifications with different types (can be more types: just need to add class to styles)
  seed() {
    const seedData: Notification[] = [
      {
        message: 'Build success',
        date: Date.now(),
        isRead: false,
        type: NotificationType.buildSuccess
      },
      {
        message: 'Build failed',
        date: Date.now(),
        isRead: false,
        type: NotificationType.buildFailed
      },
      {
        message: 'Build success',
        date: Date.now(),
        isRead: false,
        type: NotificationType.buildSuccess
      },
      {
        message: 'Build failed',
        date: Date.now(),
        isRead: false,
        type: NotificationType.buildFailed
      }
    ];
    this.notifications = seedData;
    this.cashedNotifications = this.lastThreeNotifications(this.notifications);
  }
  lastThreeNotifications(notifications: Notification[]): Notification[] {
    return notifications.filter(x => x.isRead === false).slice(-3);
  }
  showAll() {
    this.cashedNotifications = this.notifications;
    this.showAllNotifications = true;
  }

  showLast() {
    this.cashedNotifications = this.lastThreeNotifications(this.notifications);
    this.showAllNotifications = false;
    this.showRead = false;
  }
  // Add more notifications each 10 seconds
  addOnInterval() {
    setInterval(() => {
      this.notifications
        .push(
          {
            message: 'Build failed',
            date: Date.now(),
            isRead: false,
            type: NotificationType.buildFailed
          });
      if (!this.showAllNotifications) {
        this.cashedNotifications = this.lastThreeNotifications(this.notifications);
      }
      else {
        this.cashedNotifications = this.notifications;
      }
      this.onCountChange();
     }, 10000);
  }
}
