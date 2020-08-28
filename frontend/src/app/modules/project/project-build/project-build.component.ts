import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { BuildHistoryService } from '@core/services/build-history.service';
import { ActivatedRoute } from '@angular/router';
import { BuildHistory } from '@shared/models/build-history';

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
  ) {
    super();
  }

  ngOnInit(): void {
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

  getCommit(bh: BuildHistory) {
    return bh.commitHash?.substring(0, 6) ?? "—";
  }
}
