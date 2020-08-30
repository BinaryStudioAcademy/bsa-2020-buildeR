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
  public isShowRead = false;
  public counter: number;
  @Output() counterNotifications = new EventEmitter<number>();
  @Output() toggleNotifications = new EventEmitter<void>();


  constructor() {
    this.seed();
    this.addOnInterval();
    this.onCountChange();
  }

  ngOnInit(): void {
    this.cashedNotifications = this.useConditions();
  }
  useConditions() {
    if (this.showAllNotifications) {
     return this.allNotifications();
    }
    return this.lastThreeNotifications();
  }
  lastThreeNotifications(): Notification[] {
    return this.showRead().slice(-3);
  }
  allNotifications(): Notification[] {
    return this.showRead();
  }
  showRead() {
    if (!this.isShowRead) {
      return this.notifications.filter(x => x.isRead === false);
    }
    return this.notifications;
  }
  toggleShowRead() {
    this.cashedNotifications = this.useConditions();
  }
  toggleShowAll() {
    this.showAllNotifications = true;
    this.cashedNotifications = this.useConditions();
  }

  toggleShowLast() {
    this.showAllNotifications = false;
    this.cashedNotifications = this.useConditions();
  }
   // Change type of notification to read, push it into array of read notifications and delete from general array
   clearOne(notification: Notification) {
    notification.isRead = true;
    this.cashedNotifications = this.useConditions();
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
    this.cashedNotifications = this.useConditions();
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
    this.cashedNotifications = this.useConditions();
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
      this.cashedNotifications = this.useConditions();
      this.onCountChange();
     }, 10000);
  }
}
