import { NotificationType } from '../notification-type';

export interface NotificationSettingOption {
  id: number;
  notificationSettingId: number;
  notificationType: NotificationType;
  app: boolean;
  email: boolean;
  description: string;
}
