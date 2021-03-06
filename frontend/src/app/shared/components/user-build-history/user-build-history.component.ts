import { Component, OnInit } from '@angular/core';
import { BuildHistory } from '@shared/models/build-history';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { BuildStatusesSignalRService } from '@core/services/build-statuses-signalr.service';
import { BuildStatus } from '@shared/models/build-status';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-user-build-history',
  templateUrl: './user-build-history.component.html',
  styleUrls: ['./user-build-history.component.sass'],
})
export class UserBuildHistoryComponent extends BaseComponent implements OnInit {
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
  ) {
    super();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.configureBuildStatusesSignalR();
    this.route.parent.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ user }) => {
      this.user = user ?? this.authService.getCurrentUser();
      if (this.user.id !== this.authService.getCurrentUser().id) {
        this.isSameUser = false;
        this.isPublicOnly = true;
      }
    });
    this.buildHistoryService
      .getSortedByStartDateHistoryByUserId(this.user.id)
      .pipe(takeUntil(this.unsubscribe$))
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
    this.buildStatusesSignalRService.listen()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((statusChange) => {
      const buildIndex = this.builds.findIndex(
        (pi) => pi.id === statusChange.BuildHistoryId
      );
      if (buildIndex >= 0) {
        if (statusChange.Status !== BuildStatus.InProgress) {
          this.buildHistoryService
            .getBuildHistory(statusChange.BuildHistoryId)
            .pipe(takeUntil(this.unsubscribe$))
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
