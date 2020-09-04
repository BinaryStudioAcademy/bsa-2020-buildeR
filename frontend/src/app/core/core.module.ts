import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ErrorInterceptor } from './interceptors/error.interceptor.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebase } from '../../environments/firebase.config';

import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RegistrationDialogComponent } from './components/registration-dialog/registration-dialog.component';

import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { RegistrationWarningComponent } from './components/registration-warning/registration-warning.component';
import { EmailVerificationModalComponent } from './components/email-verification-modal/email-verification-modal.component';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [
    ModalContentComponent,
    SignInComponent,
    SignUpComponent,
    RegistrationDialogComponent,
    RegistrationWarningComponent,
    EmailVerificationModalComponent
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
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
  ]
})
export class CoreModule { }
