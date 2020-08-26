import { NotificationSettingType } from './notification-setting-type';

export interface NotificationSettingOption {
  id: number;
  notificationSettingId: number;
  notificationType: NotificationSettingType;
  app: boolean;
  email: boolean;
  description: string;
}
