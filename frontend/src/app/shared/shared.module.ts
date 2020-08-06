import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// Please, add all components, pipes, directives, other modules which should be shared accross all modules
// Do not forget to put them in 'exports' in order to use them outside of this module
@NgModule({
  declarations: [],
  imports: [CommonModule, NgbModule, NgbCollapseModule],
  exports: [NgbModule, NgbCollapseModule],
})
export class SharedModule {}
