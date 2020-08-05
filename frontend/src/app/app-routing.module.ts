import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsRoutes } from '../app/components/settings/settings.routing';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SettingsRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
