import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { WorkSpaceModule } from './modules/work-space/work-space.module';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [AppComponent, ModalContentComponent, TestComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    WorkSpaceModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
