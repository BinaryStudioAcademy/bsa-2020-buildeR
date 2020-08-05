import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './shell/landing-page/landing-page.component';
import { SignInComponent } from './components/register/sign-in/sign-in.component';
import { SignUpComponent } from './components/register/sign-up/sign-up.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {path: 'registration', component: RegisterComponent, children: [
    {path: 'signin', component: SignInComponent},
    {path: 'signup', component: SignUpComponent}
  ]},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
