import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CronJobsModule } from 'ngx-cron-jobs';
import { ChartBigGroupedComponent } from './components/chart-big-grouped/chart-big-grouped.component';
import { ChartBigNormalizedComponent } from './components/chart-big-normalized/chart-big-normalized.component';
import { ChartSmallComponent } from './components/chart-small/chart-small.component';
import { CronBuilderComponent } from './components/cron-builder/cron-builder.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { BuildHistoryStatusOutlineDirective } from './directives/build-history-status-outline.directive';
import { BuildHistoryStatusDirective } from './directives/build-history-status.directive';
import { LogLevelDirective } from './directives/log-level.directive';
import { BuildStatusPipe } from './pipes/build-status.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { TimespanPipe } from './pipes/timespan.pipe';
import { ProjectsDisplayComponent } from './components/projects-display/projects-display.component';
import { UserBuildHistoryComponent } from './components/user-build-history/user-build-history.component'

// Please, add all components, pipes, directives, other modules which should be shared accross all modules
// Do not forget to put them in 'exports' in order to use them outside of this module
@NgModule({
  declarations: [
    BuildStatusPipe,
    DateAgoPipe,
    LogLevelDirective,
    CronBuilderComponent,
    NotFoundComponent,
    TimespanPipe,
    BuildHistoryStatusDirective,
    BuildHistoryStatusOutlineDirective,
    TabsComponent,
    LoadingSpinnerComponent,
    ChartSmallComponent,
    ChartBigNormalizedComponent,
    ChartBigGroupedComponent,
    ProjectsDisplayComponent,
    UserBuildHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgbCollapseModule,
    CronJobsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxChartsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgbCollapseModule,
    ReactiveFormsModule,
    FormsModule,
    BuildStatusPipe,
    DateAgoPipe,
    TimespanPipe,
    LogLevelDirective,
    NotFoundComponent,
    CronBuilderComponent,
    BuildHistoryStatusDirective,
    BuildHistoryStatusOutlineDirective,
    TabsComponent,
    LoadingSpinnerComponent,
    ChartSmallComponent,
    ChartBigNormalizedComponent,
    ChartBigGroupedComponent,
    ProjectsDisplayComponent,
    UserBuildHistoryComponent
  ],
})
export class SharedModule { }
