import { NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { SharedModule } from '@shared/shared.module';
import { ProjectComponent } from './project.component';
import { ProjectResolverComponent } from './project-resolver/project-resolver.component';

@NgModule({
  declarations: [ProjectComponent, ProjectCreateComponent, ProjectSettingsComponent, ProjectResolverComponent],
  imports: [ProjectRoutingModule, SharedModule],
})
export class ProjectModule { }
