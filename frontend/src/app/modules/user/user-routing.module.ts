import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {UserResolverService} from "../../core/resolvers/user-resolver/user-resolver-service";


@NgModule({
  imports: [CommonModule, RouterModule.forChild([{
    path: '',
    component: UserComponent,
    children: [{
      path: '',
      component: UserSettingsComponent,
      resolve: {
        user: UserResolverService
      }
    }]
  }])],
  exports: [RouterModule]
})
export class UserRoutingModule { }
