import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupComponent } from './group/group.component';
import { SharedModule } from '@shared/shared.module';
import { GroupProjectsComponent } from './group-projects/group-projects.component';



@NgModule({
  declarations: [GroupListComponent, GroupComponent, GroupProjectsComponent],
  imports: [
    CommonModule,
    GroupRoutingModule,
    SharedModule
  ]
})
export class GroupModule { }
