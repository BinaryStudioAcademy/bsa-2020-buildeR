import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupResolverService } from '../../core/resolvers/group.resolver';
import { GroupComponent } from './group/group.component';
import { GroupProjectsComponent } from './group-projects/group-projects.component';
import { GroupMembersComponent } from './group-members/group-members.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { GroupCreateComponent } from './group-create/group-create.component';
import { GroupChatComponent } from './group-chat/group-chat.component';

const routes: Routes = [
  {
    path: '',
    component: GroupListComponent,
  },
  {
    path: 'new',
    component: GroupCreateComponent,
  },
  {
    path: ':groupId',
    component: GroupComponent,
    resolve: {
      group: GroupResolverService,
    },
    children: [
      {
        path: 'projects',
        component: GroupProjectsComponent,
      },
      {
        path: 'chat',
        component: GroupChatComponent
      },
      {
        path: 'members',
        component: GroupMembersComponent,
      },
      {
        path: 'settings',
        component: GroupSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
