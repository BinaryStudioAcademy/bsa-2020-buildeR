import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [UserComponent, UserSettingsComponent],
  imports: [
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
