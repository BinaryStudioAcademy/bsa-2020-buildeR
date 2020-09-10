import { Component, OnInit } from '@angular/core';
import { BuildHistory } from '@shared/models/build-history';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service';
import { BuildStatus } from '@shared/models/build-status';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-user-build-history',
  templateUrl: './user-build-history.component.html',
  styleUrls: ['./user-build-history.component.sass'],
})
export class UserBuildHistoryComponent implements OnInit {
  builds: BuildHistory[] = [];
  isLoading = true;
  user: User;

  isPublicOnly = false;
  isSameUser = true;

  constructor(
    private buildHistoryService: BuildHistoryService,
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService,
    private buildStatusesSignalRService: BuildStatusesSignalRService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.configureBuildStatusesSignalR();
    this.route.data.subscribe((data) => {
      if (data.user) {
        this.user = data.user;
        if (this.user.id !== this.authService.getCurrentUser().id) {
          this.isSameUser = false;
          this.isPublicOnly = true;
        }
      } else {
        this.user = this.authService.getCurrentUser();
      }
    });
    this.buildHistoryService
      .getSortedByStartDateHistoryByUserId(this.user.id)
      .subscribe(
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
    this.buildStatusesSignalRService.connect();
    this.buildStatusesSignalRService.listen().subscribe((statusChange) => {
      let buildIndex = this.builds.findIndex(
        (pi) => pi.id == statusChange.BuildHistoryId
      );
      if (buildIndex >= 0) {
        if (statusChange.Status != BuildStatus.InProgress) {
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

  buildHistories(): BuildHistory[] {
    return this.isPublicOnly
      ? this.builds.filter((bh) => bh.project.isPublic)
      : this.builds;
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? '—';
  }
}
