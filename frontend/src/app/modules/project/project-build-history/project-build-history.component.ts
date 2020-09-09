import { Component, OnInit } from '@angular/core';
import { BuildHistoryService } from '../../../core/services/build-history.service';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistory } from '@shared/models/build-history';
import { ActivatedRoute } from '@angular/router';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service';
import { BuildStatus } from '@shared/models/build-status';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-build-history',
  templateUrl: './project-build-history.component.html',
  styleUrls: ['./project-build-history.component.sass'],
})
export class ProjectBuildHistoryComponent extends BaseComponent
  implements OnInit {
  projectId: number;
  builds: BuildHistory[] = [];
  isLoading = true;

  constructor(
    private buildHistoryService: BuildHistoryService,
    private route: ActivatedRoute,
    private toastrService: ToastrNotificationsService,
    private buildStatusesSignalRService: BuildStatusesSignalRService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.configureBuildStatusesSignalR();
    this.route.parent.params.subscribe((params) => {
      this.projectId = params.projectId;
      this.loadProjects();
    });
    this.buildHistoryService.getLoadBuildHistoryOfProject().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => this.loadProjects());
  }

  loadProjects() {
    this.isLoading = true;
    this.buildHistoryService.getBuildHistoriesOfProject(this.projectId).subscribe(
      (response) => {
        this.builds = response.body;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.showError(error.message, error.name);
      }
    );
  }

  private configureBuildStatusesSignalR() {
    this.buildStatusesSignalRService.listen().subscribe((statusChange) => {
      const buildIndex = this.builds.findIndex(
        (pi) => pi.id === statusChange.BuildHistoryId
      );
      if (buildIndex >= 0) {
        if (statusChange.Status !== BuildStatus.InProgress) {
          this.buildHistoryService
            .getBuildHistory(statusChange.BuildHistoryId)
            .subscribe((bh) => {
              this.builds[buildIndex] = bh;
            });
        } else {
          this.builds[buildIndex].buildStatus = statusChange.Status;
        }
      }
    });
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }

  startFirstBuild() {
    document.getElementById('triggerBuildButton').click();
  }

}
