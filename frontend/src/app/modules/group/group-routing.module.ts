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
        resolve: {
          group: GroupResolverService,
        },
      },
      {
        path: 'chat',
        component: GroupChatComponent,
        resolve: {
          group: GroupResolverService,
        },
      },
      {
        path: 'members',
        component: GroupMembersComponent,
        resolve: {
          group: GroupResolverService,
        },
      },
      {
        path: 'settings',
        component: GroupSettingsComponent,
        resolve: {
          group: GroupResolverService,
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
