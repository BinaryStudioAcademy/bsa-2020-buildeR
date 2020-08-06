import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from './shell/landing-page/landing-page.component';
import {ImgComponent} from './components/img/img.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {path: 'image', component: ImgComponent},
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
