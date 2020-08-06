import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { WorkSpaceRoutingModule } from './work-space-routing.module';

@NgModule({
  declarations: [DashboardComponent, WorkSpaceComponent],
  imports: [CommonModule, SharedModule, RouterModule, WorkSpaceRoutingModule],
})
export class WorkSpaceModule {}
