import { NotificationType } from './notification-type';
import { User } from './user/user';

export interface Notification {
  id: number
  message: string;
  date: Date;
  isRead: boolean;
  type: NotificationType;
  userId: number,
}
