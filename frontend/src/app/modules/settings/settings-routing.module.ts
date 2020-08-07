import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './user-settings/user-settings.component';


@NgModule({
  imports: [CommonModule, RouterModule.forChild([{
    path: '',
    component: SettingsComponent,
    children: [{
      path: '',
      component: UserSettingsComponent
    }]
  }])],
  exports: [RouterModule]
})
export class UserRoutingModule { }
