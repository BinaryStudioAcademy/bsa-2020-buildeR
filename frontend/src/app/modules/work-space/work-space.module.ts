import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WorkSpaceRoutingModule } from './work-space-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkSpaceComponent } from './work-space/work-space.component';

@NgModule({
  declarations: [DashboardComponent, WorkSpaceComponent],
  imports: [SharedModule, WorkSpaceRoutingModule],
})
export class WorkSpaceModule {}
