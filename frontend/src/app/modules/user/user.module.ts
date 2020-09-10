import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from '@shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PhotoCropperContentComponent } from './photo-cropper-content/photo-cropper-content.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { InsightsComponent } from './insights/insights.component';
import { CredentialSettingsComponent } from './credential-settings/credential-settings.component';

@NgModule({
  declarations: [
    UserComponent,
    UserSettingsComponent,
    PhotoCropperContentComponent,
    NotificationSettingComponent,
    InsightsComponent,
    CredentialSettingsComponent],
  imports: [
    UserRoutingModule,
    SharedModule,
    ImageCropperModule
  ]
})
export class UserModule { }
