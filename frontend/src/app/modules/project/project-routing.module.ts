import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectComponent } from './project.component';
import { ProjectResolverService } from '@core/resolvers/project.resolver';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectBuildHistoryComponent } from './project-build-history/project-build-history.component';
import { ProjectBuildStepsComponent } from './project-build-steps/project-build-steps.component';
import { ProjectBuildComponent } from './project-build/project-build.component';
const routes: Routes = [
  {
    path: 'create',
    component: ProjectCreateComponent,
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    resolve: {
      project: ProjectResolverService,
    },
    children: [
      {
        path: 'settings',
        component: ProjectSettingsComponent,
      },
      {
        path: 'details',
        component: ProjectDetailsComponent,
      },
      {
        path: 'history',
        component: ProjectBuildHistoryComponent,
      },
      {
        path: 'history/:buildId',
        component: ProjectBuildComponent,
      },
      {
        path: 'steps',
        component: ProjectBuildStepsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
