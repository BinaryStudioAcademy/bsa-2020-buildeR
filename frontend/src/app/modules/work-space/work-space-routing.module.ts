import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectResolverComponent } from '@modules/project/project-resolver/project-resolver.component';

const routes = [{
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
      path: 'user',
      loadChildren: () => import('../../modules/user/user.module')
        .then(m => m.UserModule)
    },
    {
      path: 'projects',
      loadChildren: () => import('../../modules/project/project.module')
        .then(m => m.ProjectModule)
    },
    {
      path: '**',
      loadChildren: () => import('@modules/not-found/not-found.module')
        .then(m => m.NotFoundModule),
      pathMatch: 'full',
      skipLocationChange: true
    },
  ],
},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ProjectResolverComponent]
})
export class WorkSpaceRoutingModule { }
