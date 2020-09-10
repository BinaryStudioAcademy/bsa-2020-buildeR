import { Injectable } from '@angular/core';
import { Notification } from '@shared/models/notification';

@Injectable({
  providedIn: 'root'
})
export class AppNotificationsToasterService {
  toasts: Notification[] = [];

  constructor() { }

  public show(notification: Notification) {
    this.toasts.push(notification);
  }

  public remove(toast) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
