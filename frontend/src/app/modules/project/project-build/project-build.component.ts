import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute } from '@angular/router';
import { BuildHistory } from '@shared/models/build-history';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service'
import { BuildStatus } from '@shared/models/build-status';

@Component({
  selector: 'app-project-build',
  templateUrl: './project-build.component.html',
  styleUrls: ['./project-build.component.sass'],
})
export class ProjectBuildComponent extends BaseComponent implements OnInit {

  buildHistory: BuildHistory;

  constructor(
    private buildHistoryService: BuildHistoryService,
    private route: ActivatedRoute,
    private buildStatusesSignalRService: BuildStatusesSignalRService
  ) {
    super();
  }

  ngOnInit(): void {
    this.configureBuildStatusesSignalR();
    this.route.params.subscribe((params) => {
      this.buildHistoryService.getBuildHistory(params.buildId).subscribe(
        (response) => {
          this.buildHistory = response;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  private configureBuildStatusesSignalR() {
    this.buildStatusesSignalRService.listen().subscribe((statusChange) => {
      if (statusChange.Status != BuildStatus.InProgress) {
        this.buildHistoryService.getBuildHistory(statusChange.BuildHistoryId).subscribe((bh) => {
          if (bh.id == this.buildHistory.id) {
            this.buildHistory = bh;
          }
        });
      } else {
        this.buildHistory.buildStatus = statusChange.Status
      }
    });
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? "—";
  }
}
