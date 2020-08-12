import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ErrorInterceptor } from './interceptors/error.interceptor.service';

import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [
    ModalContentComponent,
    LandingPageComponent,
    SignInComponent,
    SignUpComponent,
  ],
  imports: [HttpClientModule, SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [
    LandingPageComponent,
    SignInComponent,
    SignUpComponent,
  ]
})
export class CoreModule { }
