import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildHistory } from '@shared/models/build-history';
import { AuthenticationService } from '@core/services/authentication.service';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { Project } from '@shared/models/project/project';
import { combineLatest } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service';
import { BuildStatus } from '@shared/models/build-status';

@Component({
  selector: 'app-project-build',
  templateUrl: './project-build.component.html',
  styleUrls: ['./project-build.component.sass'],
})
export class ProjectBuildComponent extends BaseComponent implements OnInit {
  buildHistory: BuildHistory;
  project: Project;
  isCurrent: boolean;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrNotificationsService,
    private authService: AuthenticationService,
    private buildHistoryService: BuildHistoryService,
    private projectService: ProjectService,
    private buildStatusesSignalRService: BuildStatusesSignalRService,
  ) {
    super();
  }

  ngOnInit() {
    this.listenToRouteChanges();
    this.configureBuildStatusesSignalR();
  }

  listenToRouteChanges() {
    combineLatest([this.route.params, this.route.parent.data])
      .pipe(
        tap(([params, routeData]) => {
          this.isLoading = true;
          this.isCurrent = !params.buildId;
          this.project = routeData.project;
        }),
        switchMap(([params, routeData]) => params.buildId
          ? this.buildHistoryService.getBuildHistory(params.buildId)
          : this.buildHistoryService.getLastBuildHistoryByProject(routeData.project.id)),
        tap(history => this.buildHistory = history),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(history => {
        this.buildHistory = history;
        this.isLoading = false;
      }, (res: HttpErrorResponse) => {
        this.toastrService.showError(res.error, res.name);
        this.isLoading = false;
      });
  }

  private configureBuildStatusesSignalR() {
    this.buildStatusesSignalRService.connect();
    this.buildStatusesSignalRService.listen()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((statusChange) => {
        if (statusChange.BuildHistoryId === this.buildHistory?.id) {
          this.buildHistory.buildStatus = statusChange.Status;
          if (statusChange.Status !== BuildStatus.InProgress) {
            this.buildHistory.buildStatus = statusChange.Status;
            this.buildHistoryService
              .getBuildHistory(statusChange.BuildHistoryId)
              .subscribe((bh) => {
                this.buildHistory = bh;
              });
          }
        }
      });
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }

  restartBuild() {
    const user = this.authService.getCurrentUser();
    const history = {
      branchHash: this.buildHistory.branchHash,
      projectId: this.buildHistory.projectId,
      performerId: user.id,
    } as NewBuildHistory;

    const msg = `You’ve successfully restarted a build for ${history.branchHash} branch of ${this.project.name}. Hold tight, it might take a moment to show up.`;

    this.projectService
      .startProjectBuild(history)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (newHistory) => {
          this.toastrService.showSuccess(msg);
          this.openHistory(newHistory);
        },
        (error) => this.toastrService.showError(error.error, error.name)
      );
  }

  openHistory({ id, projectId }: BuildHistory) {
    this.router.navigateByUrl(`/portal/projects/${projectId}/history/${id}`);
  }
}
