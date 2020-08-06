import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BuildStatusPipe } from './pipes/build-status.pipe';
import { BuildStatusColorDirective } from './directives/build-status-color.directive';
import { BuildStatusIconDirective } from './directives/build-status-icon.directive';

// Please, add all components, pipes, directives, other modules which should be shared accross all modules
// Do not forget to put them in 'exports' in order to use them outside of this module
@NgModule({
  declarations: [
    BuildStatusPipe,
    BuildStatusColorDirective,
    BuildStatusIconDirective,
  ],
  imports: [CommonModule, NgbModule, NgbCollapseModule],
  exports: [
    NgbModule,
    NgbCollapseModule,
    BuildStatusPipe,
    BuildStatusColorDirective,
    BuildStatusIconDirective,
  ],
})
export class SharedModule {}
