import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolverService } from '../../core/resolvers/user.resolver';
import { CredentialSettingsComponent } from './credential-settings/credential-settings.component';
import { InsightsComponent } from './insights/insights.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserComponent } from './user.component';
import { UserBuildHistoryComponent } from './user-build-history/user-build-history.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: {
      user: UserResolverService
    },
    children: [{
      path: '',
      component: UserSettingsComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: 'notificationsettings',
      component: NotificationSettingComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: "history",
      component: UserBuildHistoryComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: 'insights',
      component: InsightsComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: 'credentialsettings',
      component: CredentialSettingsComponent,
      resolve: {
        user: UserResolverService
      }
    }
    ]
  },
  {
    path: ':userId',
    component: UserComponent,
    resolve: {
      user: UserResolverService
    },
    children: [{
      path: '',
      component: UserSettingsComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: "history",
      component: UserBuildHistoryComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: 'insights',
      component: InsightsComponent,
      resolve: {
        user: UserResolverService
      }
    }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
