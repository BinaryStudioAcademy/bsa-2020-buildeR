import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';


@NgModule({
  imports: [CommonModule, RouterModule.forChild([{
    path: '',
    component: UserComponent,
    children: [{
      path: '',
      component: UserSettingsComponent
    }]
  }])],
  exports: [RouterModule]
})
export class UserRoutingModule { }
