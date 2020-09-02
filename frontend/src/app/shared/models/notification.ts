import { NotificationType } from './notification-type';

export interface Notification {
  id: number
  message: string;
  date: Date;
  isRead: boolean;
  type: NotificationType;
  userId: number,
}
