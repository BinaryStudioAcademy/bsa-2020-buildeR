import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { WorkSpaceModule } from './modules/work-space/work-space.module';
// import { ShellModule } from './shell/shell.module';
// import { ModalContentComponent } from './components/modal-content/modal-content.component';
// import { TestComponent } from './components/test/test.component';
import { ProjectModule } from './modules/project/project.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    WorkSpaceModule,
    // ShellModule,
    BrowserAnimationsModule,
    ProjectModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
