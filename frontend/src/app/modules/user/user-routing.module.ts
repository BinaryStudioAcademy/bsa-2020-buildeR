import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolverService } from '../../core/resolvers/user.resolver';
import { CredentialSettingsComponent } from './credential-settings/credential-settings.component';
import { InsightsComponent } from './insights/insights.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserComponent } from './user.component';
import { UserBuildHistoryComponent } from '../../shared/components/user-build-history/user-build-history.component';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  resolve: {
    user: UserResolverService
  },
  children: [{
    path: '',
    component: UserSettingsComponent,
  }, {
    path: 'notificationsettings',
    component: NotificationSettingComponent,
  }, {
    path: 'history',
    component: UserBuildHistoryComponent,
  }, {
    path: 'insights',
    component: InsightsComponent,
  }, {
    path: 'credentialsettings',
    component: CredentialSettingsComponent,
  }]
}, {
  path: ':userId',
  component: UserComponent,
  resolve: {
    user: UserResolverService
  },
  children: [{
    path: '',
    component: UserSettingsComponent,
  }, {
    path: 'history',
    component: UserBuildHistoryComponent,
  }, {
    path: 'insights',
    component: InsightsComponent,
  }]
}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
