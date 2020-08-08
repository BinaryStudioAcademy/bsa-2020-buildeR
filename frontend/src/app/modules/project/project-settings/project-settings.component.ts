import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent extends BaseComponent
implements OnInit, OnDestroy {

  project: Project = {} as Project;
  cachedSettingsProject: Project = {} as Project;
  isLoading = false;
  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService
    )
  {
    super();
  }

  ngOnInit(): void {

  }
  getProject(projectId: number) {
      this.isLoading = true;
      this.projectService
      .getProjectById(projectId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (resp) => {
            this.isLoading = false;
            this.cachedSettingsProject = this.project = resp.body;
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          }
        );
  }
  save() {}
}
