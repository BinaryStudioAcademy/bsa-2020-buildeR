import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from './shell/landing-page/landing-page.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SettingsComponent } from '@modules/settings/settings.component';
import { UserSettingsComponent } from '@modules/settings/user-settings/user-settings.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {
    path: 'user',
    component: SettingsComponent,
    children: [{
      path: 'settings',
      component: UserSettingsComponent
    }]
  },
  {
    path: 'portal',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/work-space/work-space.module').then(
        (m) => m.WorkSpaceModule
      ),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
