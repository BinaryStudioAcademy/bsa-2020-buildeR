import { Routes, RouterModule } from '@angular/router';
import { UserSettingsComponent } from '../settings/user-settings/user-settings.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { SettingsComponent } from './settings.component';
const routes: Routes = [
    { path: 'portal/user', component: UserSettingsComponent },
    { path: 'portal/porject', component: ProjectSettingsComponent}

];

export const SettingsRoutes = RouterModule.forChild(routes);
