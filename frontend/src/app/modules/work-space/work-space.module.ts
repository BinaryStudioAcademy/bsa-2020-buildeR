import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WorkSpaceRoutingModule } from './work-space-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { NotificationsBlockComponent } from './notifications-block/notifications-block.component';
import { ProjectModule } from '@modules/project/project.module';
import {HelpComponent} from "@modules/work-space/help/help.component";

@NgModule({
  declarations: [DashboardComponent, WorkSpaceComponent, NotificationsBlockComponent, HelpComponent],
  imports: [SharedModule, WorkSpaceRoutingModule, ProjectModule],
})
export class WorkSpaceModule {}
