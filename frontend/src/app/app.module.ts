import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { WorkSpaceModule } from './modules/work-space/work-space.module';
import { ShellModule } from './shell/shell.module';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { TestComponent } from './components/test/test.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ImgComponent } from './components/img/img.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [AppComponent, ModalContentComponent, TestComponent, SignInComponent, SignUpComponent, ImgComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    WorkSpaceModule,
    ShellModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
