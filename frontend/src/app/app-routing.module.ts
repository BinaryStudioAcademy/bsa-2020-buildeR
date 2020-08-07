import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from '@core/components/landing-page/landing-page.component';
import { SignUpComponent } from '@core/components/sign-up/sign-up.component';
import { SignInComponent } from '@core/components/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
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
export class AppRoutingModule { }
