import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistoryService } from '@core/services/build-history.service';
import { NotificationsService } from '@core/services/notifications.service';
import { takeUntil } from 'rxjs/operators';
import { Notification } from '../../../shared/models/notification';
import { NotificationType } from '../../../shared/models/notification-type';

@Component({
  selector: 'app-notifications-block',
  templateUrl: './notifications-block.component.html',
  styleUrls: ['./notifications-block.component.sass'],
})
export class NotificationsBlockComponent extends BaseComponent implements OnInit {
  notifications: Notification[] = [];
  NotificationType = NotificationType;
  showAllNotifications = false;
  isShowingRead = false;
  counter: number;
  @ViewChild('top') private top: ElementRef;

  @Output() counterNotifications = new EventEmitter<number>();
  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(
    private notificationService: NotificationsService,
    private router: Router,
    private buildHistoryService: BuildHistoryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notifications) => {
        this.notifications = notifications.reverse();
        this.onChanging('adding', ...notifications);
      });
    this.notificationService.connect();
    this.notificationService.listen()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notification) => {
        if (!notification.isRead && !this.notifications.some(n => n.id === notification.id)) {
          this.notifications.unshift(notification);
          this.onChanging('adding', notification);
        }
      });
  }

  clearOne(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
    notification.isRead = true;
    this.onChanging('reading', notification);
  }

  clearAll() {
    this.notifications.forEach((notification) => {
      this.clearOne(notification);
    });
  }

  toggle() {
    this.toggleNotifications.emit();
  }

  onChanging(type: 'adding' | 'reading', ...notifications: Notification[]) {
    if (type === 'adding') {
      if (this.isShowingRead) {
        this.counterNotifications.emit(notifications.length);
      } else {
        const unreadCount = notifications.reduce((acc, n) => acc + (n.isRead ? 0 : 1), 0);
        this.counterNotifications.emit(unreadCount);
      }
    } else {
      if (!this.isShowingRead) {
        this.counterNotifications.emit(-notifications.length);
      }
    }
  }

  navigateToItem(notification: Notification, event) {
    if (!notification.itemId) {
      return;
    }
    event.preventDefault();
    switch (notification.type) {
      case NotificationType.Group: {
        this.router.navigate(notification.itemId === -1 ? ['/portal/groups'] : ['/portal/groups/' + notification.itemId + '/projects']);
        this.clearOne(notification);
        this.toggle();
        break;
      }
      case NotificationType.BuildCanceled:
      case NotificationType.BuildErrored:
      case NotificationType.BuildFailed:
      case NotificationType.BuildSucceeded: {
        this.buildHistoryService.getBuildHistory(notification.itemId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            bh => this.router.navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['portal', 'projects', bh.projectId, 'history', notification.itemId]);
                this.clearOne(notification);
              })
          );
        break;
      }
    }
  }
}
