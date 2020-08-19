import { NotificationSettingType } from './notification-setting-type';

export interface NotificationSetting {
  id: number;
  userId: number;
  notificationType: NotificationSettingType;
  app: boolean;
  email: boolean;
  description: string;
}

