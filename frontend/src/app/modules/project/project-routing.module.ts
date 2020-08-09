import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
{
  path: 'create',
  component: ProjectCreateComponent
},
{
  path: ':projectId',
  component: ProjectComponent,
  children: [
    {
      path: 'settings',
      component: ProjectSettingsComponent
    }
  ]
},
];


@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
