import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes = [
  {
    path: '',
    component: WorkSpaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dashboard/user',
        loadChildren: () =>
          import('../../modules/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'dashboard/projects',
        loadChildren: () =>
          import('../../modules/project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: '**',
        component: NotFoundComponent,
        pathMatch: 'full',
        skipLocationChange: true,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class WorkSpaceRoutingModule {}
