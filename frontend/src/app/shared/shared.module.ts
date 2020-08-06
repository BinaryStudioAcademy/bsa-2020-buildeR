import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

// Please, add all components, pipes, directives, other modules which should be shared accross all modules
// Do not forget to put them in 'exports' in order to use them outside of this module
@NgModule({
  declarations: [],
  imports: [CommonModule, NgbModule, NgbCollapseModule, ReactiveFormsModule],
  exports: [NgbModule, NgbCollapseModule, ReactiveFormsModule],
})
export class SharedModule {}
