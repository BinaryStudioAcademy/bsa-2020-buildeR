import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';

const routes: Routes = [
  {
    path: '',
    component: GroupListComponent,
  },
  // {
  //   path: ':groupId',
  //   component: GroupComponent,
  //   resolve: {
  //     project: GroupResolverService,
  //   },
  //   children: [
  //     {
  //       path: 'settings',
  //       component: GroupSettingsComponent,
  //     },
  //     {
  //       path: 'details',
  //       component: GroupDetailsComponent,
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule { }
