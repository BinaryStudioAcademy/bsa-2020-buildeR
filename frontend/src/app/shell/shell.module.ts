import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    NgbModule
  ]
})
export class ShellModule { }
