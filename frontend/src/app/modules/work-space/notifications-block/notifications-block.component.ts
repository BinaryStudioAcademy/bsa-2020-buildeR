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
  public readNotifications: Notification[] = [];
  public NotificationType = NotificationType;

  @Output() toggleNotifications = new EventEmitter<void>();

  constructor() {
    this.seed();
    this.addOnInterval();
  }

  // Change type of notification to read, push it into array of read notifications and delete from general array
  clearOne(notification: Notification) {
    notification.isRead = true;
    this.readNotifications.push(notification);

    const index = this.notifications.indexOf(notification);
    this.notifications.splice(index, 1);
    }

  // Change type of all notifications to read, push them inro  array of read notifications and delete from general array
  clearAll() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
      this.readNotifications.push(notification);
    });
    this.notifications = [];
  }

  ngOnInit(): void {
  }

  toggle() {
    this.toggleNotifications.emit();
  }

  // First 3 notifications with different types (can be more types: just need to add class to styles)
  seed() {
    const seedData: Notification[] = [
      {
        message: 'First notification',
        date: Date.now(),
        isRead: false,
        type: NotificationType.personal
      },
      {
        message: 'Second notification',
        date: Date.now(),
        isRead: false,
        type: NotificationType.group
      },
      {
        message: 'Third notification',
        date: Date.now(),
        isRead: false,
        type: NotificationType.build
      }
    ];
    this.notifications = seedData;
  }

  // Add more notifications each 3 seconds
  addOnInterval() {
    setInterval(() => { this.notifications
        .push(
          {
            message: 'Another notification',
            date: Date.now(),
            isRead: false,
            type: NotificationType.build
          });
        }, 3000);
  }
}
