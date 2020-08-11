import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectComponent } from './project.component';
import { ProjectResolverService } from '@core/resolvers/project-resolver.service';
const routes: Routes = [
{
  path: 'create',
  component: ProjectCreateComponent
},
{
  path: ':projectId',
  component: ProjectComponent,
  resolve: {
    project: ProjectResolverService
  },
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
