import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupComponent } from './group/group.component';
import { SharedModule } from '@shared/shared.module';
import { GroupCreateComponent } from './group-create/group-create.component';
import { GroupProjectsComponent } from './group-projects/group-projects.component';
import { GroupMembersComponent } from './group-members/group-members.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { GroupChatComponent } from './group-chat/group-chat.component';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupComponent,
    GroupProjectsComponent,
    GroupMembersComponent,
    GroupSettingsComponent,
    GroupCreateComponent,
    GroupChatComponent
  ],
  imports: [
    CommonModule,
    GroupRoutingModule,
    SharedModule
  ]
})
export class GroupModule { }
