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
export class NotificationsBlockComponent extends BaseComponent implements OnInit, AfterViewChecked {
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

  ngAfterViewChecked(): void {
    this.scrollTop();
  }

  ngOnInit(): void {
    this.notificationService.connect();
    this.notificationService.listen().subscribe((notification) => {
      if (!notification.isRead && !this.notifications.some(n => n.id === notification.id)) {
        this.notifications.push(notification);
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

  onChanging(type: 'adding' | 'reading', notification: Notification) {
    if (type === 'adding') {
      if (this.isShowingRead || !notification.isRead) {
        this.counterNotifications.emit(1);
      }
    } else {
      if (!this.isShowingRead) {
        this.counterNotifications.emit(-1);
      }
    }
  }

  navigateToItem(notification: Notification, event) {
    if (notification.itemId) {
      event.preventDefault();
      switch (notification.type) {
        case NotificationType.Group: {
          if (notification.itemId === -1) {
            this.router.navigate(['/portal/groups']);
          }
          else {
            this.router.navigate(['/portal/groups/' + notification.itemId + '/projects']);
          }
          this.clearOne(notification);
          this.toggle();
          break;
        }
        case NotificationType.BuildCanceled:
        case NotificationType.BuildErrored:
        case NotificationType.BuildFailed:
        case NotificationType.BuildSucceeded: {
          this.buildHistoryService.getBuildHistory(notification.itemId).subscribe(
            bh => this.router.navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['portal', 'projects', bh.projectId, 'history', notification.itemId]);
                this.clearOne(notification);
              }),
            err => console.error(err),
          );
          break;
        }
      }
    }
  }

  scrollTop(el: HTMLElement = this.top.nativeElement) {
    el.scrollIntoView();
}
}
