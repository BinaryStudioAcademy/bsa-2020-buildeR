import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import {LandingPageComponent} from "./landing-page.component";
import {LandingPageContentComponent} from "./landing-page-content.component/landing-page-content.component";
import {LandingPageRoutingModule} from "./landing-page-routing.module";


@NgModule({
  declarations: [LandingPageComponent, LandingPageContentComponent],
  imports: [
    SharedModule, LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
