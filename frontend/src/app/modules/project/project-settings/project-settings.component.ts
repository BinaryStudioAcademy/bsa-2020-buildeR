import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  projectId: number;
  project: Project = {} as Project;
  tempProjectName: string;
  tempProjectDescription: string;
  isLoading = false;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  )
  {
    route.parent.params.subscribe(
      (params) => this.projectId = params.projectId);
  }

  ngOnInit(): void {
    this.getProject(this.projectId);
  }
  getProject(projectId: number) {
      this.isLoading = true;
      this.projectService
      .getProjectById(projectId)
        .subscribe(
          (data) => {
            this.isLoading = false;
            this.tempProjectName = data.name;
            this.tempProjectDescription = data.description;
            this.project = data;
          },
          (error) => {
            this.isLoading = false;
            this.toastrService.showError(error.message, error.name);
          }
        );
  }
  reset() {
    this.tempProjectName = this.project.name;
    this.tempProjectDescription = this.project.description;
  }
  save() {
    this.project.name = this.tempProjectName;
    this.project.description = this.tempProjectDescription;

    this.projectService.updateProject(this.project).subscribe(
      (resp) => {
        this.toastrService.showSuccess('settings updated');
      },
      (error) => {
        this.toastrService.showError(error.error);
      }
    );
  }
}
