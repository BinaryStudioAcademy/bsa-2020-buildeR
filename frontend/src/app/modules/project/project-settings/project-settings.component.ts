import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  projectId: number;
  project: Project = {} as Project;
  public projectForm: FormGroup;
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
    this.projectService.getProjectById(this.projectId).subscribe((res) => {
      this.project = res;
    }, (err) => this.toastrService.showError(err));


    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name,
        [
          Validators.required
        ]),
        description: new FormControl(this.project.description,
          [
            Validators.required
          ])
    });
  }


  // getProject(projectId: number) {
  //     this.isLoading = true;
  //     this.projectService
  //     .getProjectById(projectId)
  //       .subscribe(
  //         (data) => {
  //           this.isLoading = false;
  //           this.tempProjectName = data.name;
  //           this.tempProjectDescription = data.description;
  //           this.project = data;
  //         },
  //         (error) => {
  //           this.isLoading = false;
  //           this.toastrService.showError(error.message, error.name);
  //         }
  //       );
  // }
  reset() {
  }
  save() {
  }
}
