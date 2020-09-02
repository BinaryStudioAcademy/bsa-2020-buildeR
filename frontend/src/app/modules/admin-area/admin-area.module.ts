import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { AdminAreaComponent } from './admin-area/admin-area.component';
import { PluginsComponent } from './plugins/plugins.component';
import { AdminAreaRoutingModule } from './admin-area-routing.module';



@NgModule({
  declarations: [AdminAreaComponent, PluginsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminAreaRoutingModule
  ]
})
export class AdminAreaModule { }
