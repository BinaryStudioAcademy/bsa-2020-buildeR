import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { AdminAreaComponent } from './admin-area/admin-area.component';
import { PluginsComponent } from './plugins/plugins.component';
import { AdminAreaRoutingModule } from './admin-area-routing.module';
import { AdminGuard } from '@core/guards/admin.guard';
import {RequestsComponent} from "@modules/admin-area/requests/requests.component";



@NgModule({
  declarations: [AdminAreaComponent, PluginsComponent, RequestsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminAreaRoutingModule
  ],
  providers: [AdminGuard]
})
export class AdminAreaModule { }
