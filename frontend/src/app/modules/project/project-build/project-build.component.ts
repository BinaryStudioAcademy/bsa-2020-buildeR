import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute } from '@angular/router';
import { BuildHistory } from '@shared/models/build-history';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { NewBuildHistory } from '@shared/models/new-build-history';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { takeUntil } from 'rxjs/operators';
import { Project } from '@shared/models/project/project';
import { BuildLogService } from '@core/services/build-log.service';
import { ProjectLogsService } from '@core/services/projects-logs.service';
import { Log } from '../logging-terminal/logging-terminal.component';

@Component({
  selector: 'app-project-build',
  templateUrl: './project-build.component.html',
  styleUrls: ['./project-build.component.sass'],
})
export class ProjectBuildComponent extends BaseComponent implements OnInit {
  currentUser: User;
  buildHistory: BuildHistory;
  projectId: number;
  project: Project;
  logs: Log[];

  constructor(
    private buildHistoryService: BuildHistoryService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService,
    private projectService: ProjectService,
    private logsService: ProjectLogsService
  ) {
    super();
    route.parent.params.subscribe((params) => this.projectId = params.projectId);
    route.parent.data.subscribe((data) => {
      this.project = data.project;
      this.getBuildHistory();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // this.getBuildHistory();
    // this.getProject();
  }

  getBuildHistory() {
    this.route.params.subscribe((params) => {
      this.buildHistoryService.getBuildHistory(params.buildId).subscribe(
        (response) => {
          this.buildHistory = response;
          this.getLogs();
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  getLogs(){
    this.logsService.getLogsOfHistory(this.projectId, this.buildHistory.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      this.logsService.sendLogs(res);
    });
  }

  getProject() {
    this.projectService.getProjectById(this.projectId).subscribe(
      (response) => {
        this.project = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }

  restartBuild() {
    const newBuildHistory = {
      branchHash: this.buildHistory.branchHash,
      performerId: this.currentUser.id,
      projectId: this.buildHistory.projectId,
      commitHash: null,
    } as NewBuildHistory;
    this.toastrService.showSuccess(
      `You’ve successfully restarted a build for ${newBuildHistory.branchHash} branch of ${this.project.name}. Hold tight, it might take a moment to show up.`
    );
    this.projectService
      .startProjectBuild(newBuildHistory)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (buildHistory) => {
        },
        (error) => this.toastrService.showError(error)
      );
  }
}
