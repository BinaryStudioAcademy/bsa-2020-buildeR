import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectComponent } from './project.component';


const routes: Routes = [];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(
  [
    {
      path: 'create',
      component: ProjectCreateComponent
    },
    {
      path: ':id',
      component: ProjectComponent,
      children: [
      {
        path: '',
        component: ProjectSettingsComponent
      },
      {
        path: 'settings',
        component: ProjectSettingsComponent
      },
      ]
    },
  ])],

  exports: [RouterModule]
})
export class ProjectRoutingModule { }
