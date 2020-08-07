import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
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
            path: '**',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ],
      },
    ]),
  ],
})
export class WorkSpaceRoutingModule {}
