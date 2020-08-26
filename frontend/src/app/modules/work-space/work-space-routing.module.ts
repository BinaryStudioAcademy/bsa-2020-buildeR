import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import {HelpComponent} from "@modules/work-space/help/help.component";

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
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../../modules/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('../../modules/project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('../../modules/group/group.module').then(
            (m) => m.GroupModule
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
export class WorkSpaceRoutingModule { }
