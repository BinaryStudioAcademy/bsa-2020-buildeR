import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAreaComponent } from './admin-area/admin-area.component';
import { PluginsComponent } from './plugins/plugins.component';
import { CommonModule } from '@angular/common';
import {RequestsComponent} from '@modules/admin-area/requests/requests.component';
import {RequestsResolver} from '@core/resolvers/requests.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminAreaComponent,
    children: [
    {
      path: 'plugins',
      component: PluginsComponent,
    },
      {
        path: 'requests',
        component: RequestsComponent,
        resolve:
          {
            userLetters: RequestsResolver
          }
      }]
  },

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAreaRoutingModule { }
