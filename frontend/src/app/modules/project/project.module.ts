import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronBuilderComponent } from './components/cron-builder/cron-builder.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CronJobsModule } from 'ngx-cron-jobs';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CronBuilderComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    CronJobsModule,
    FormsModule,
  ],
})
export class ProjectModule { }
