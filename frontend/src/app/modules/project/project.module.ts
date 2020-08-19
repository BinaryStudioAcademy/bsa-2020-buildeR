import { NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { SharedModule } from '@shared/shared.module';
import { ProjectComponent } from './project.component';
import { LoggingTerminalComponent } from './logging-terminal/logging-terminal.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectTriggersComponent } from './project-triggers/project-triggers.component';
import { ProjectBuildHistoryComponent } from './project-build-history/project-build-history.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectCreateComponent,
    ProjectSettingsComponent,
    LoggingTerminalComponent,
    ProjectDetailsComponent,
    ProjectTriggersComponent,
    ProjectBuildHistoryComponent
  ],
  imports: [ProjectRoutingModule, SharedModule, NgSelectModule],
})
export class ProjectModule { }
