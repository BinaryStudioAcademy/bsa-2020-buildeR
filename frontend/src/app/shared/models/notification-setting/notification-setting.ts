import { NotificationSettingOption } from './notification-setting-option';

export interface NotificationSetting {
  id: number;
  userId: number;
  enableApp: boolean;
  enableEmail: boolean;
  notificationSettingOptions: NotificationSettingOption [];
}

