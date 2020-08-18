import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ErrorInterceptor } from './interceptors/error.interceptor.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebase } from '../../environments/firebase.config';

import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RegistrationDialogComponent } from './components/registration-dialog/registration-dialog.component';

import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';

@NgModule({
  declarations: [
    ModalContentComponent,
    LandingPageComponent,
    SignInComponent,
    SignUpComponent,
    RegistrationDialogComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    AngularFireModule.initializeApp(firebase.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [
    AuthGuard,
    HomeGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [
    LandingPageComponent,
    SignInComponent,
    SignUpComponent,
  ]
})
export class CoreModule { }
