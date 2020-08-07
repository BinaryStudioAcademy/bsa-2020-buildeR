import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { SafePipePipe } from '@shared/pipes/SafePipe.pipe';


@NgModule({
  declarations: [SettingsComponent, UserSettingsComponent],
  imports: [
    CommonModule,
    RouterModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
