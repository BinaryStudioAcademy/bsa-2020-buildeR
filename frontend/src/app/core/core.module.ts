import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    SharedModule
  ]
})
export class CoreModule { }
