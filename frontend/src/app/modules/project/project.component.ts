import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit } from '@angular/core';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ProjectService } from '@core/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {

  project: Project = {} as Project;
  isLoading = false;
  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService
    )
  {  }

  ngOnInit(): void {

  }
  getProject(projectId: number) {
      this.isLoading = true;
      this.projectService
      .getProjectById(projectId)
        .subscribe(
          (resp) => {
            this.isLoading = false;
            this.project = resp.body;
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error);
          }
        );
  }

}
