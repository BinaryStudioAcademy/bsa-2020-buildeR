import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class WorkSpaceRoutingModule { }
