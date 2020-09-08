import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageContentComponent} from './landing-page-content.component/landing-page-content.component';
import {HelpComponent} from '../work-space/help/help.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: LandingPageContentComponent
      },
      {
        path: 'about',
        component: AboutUsComponent
      },
      {
        path: 'help',
        component: HelpComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LandingPageRoutingModule {}
