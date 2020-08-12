import { NotificationType } from './notification-type';

export interface Notification {
  message: string;
  date: number;
  isRead: boolean;
  type: NotificationType;
}
