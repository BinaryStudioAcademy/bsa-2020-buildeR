import { Component, OnInit } from '@angular/core';
import { BuildHistoryService } from '../../../core/services/build-history.service';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistory } from '@shared/models/build-history';
import { ActivatedRoute } from '@angular/router';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-project-build-history',
  templateUrl: './project-build-history.component.html',
  styleUrls: ['./project-build-history.component.sass'],
})
export class ProjectBuildHistoryComponent extends BaseComponent
  implements OnInit {
  projectId: number;
  builds: BuildHistory[] = [];

  constructor(
    private buildHistoryService: BuildHistoryService,
    private route: ActivatedRoute,
    private toastrService: ToastrNotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.projectId = params.projectId;
      this.buildHistoryService.getBuildHistoriesOfProject(this.projectId).subscribe(
        (response) => {
          this.builds = response.body;
        },
        (error) => {
          this.toastrService.showError(error.message, error.name);
        }
      );
    });
  }

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? "—";
  }
}
