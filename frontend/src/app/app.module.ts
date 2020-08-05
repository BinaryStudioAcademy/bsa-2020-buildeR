import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { UserSettingsComponent } from './components/settings/user-settings/user-settings.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProjectSettingsComponent } from './components/settings/project-settings/project-settings.component';

@NgModule({
  declarations: [AppComponent, ModalContentComponent, UserSettingsComponent, SettingsComponent, ProjectSettingsComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
