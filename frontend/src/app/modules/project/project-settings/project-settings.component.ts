import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  isLoading = false;
  projectId: number;
  branches: string [] = ['master', 'dev'];
  public projectForm: FormGroup;
  @Input() project: Project = {} as Project;
  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  )
  {
    route.parent.params.subscribe(
      (params) => this.projectId = params.projectId);
    this.route.parent.data.subscribe(data => this.project = data.project);
    console.log(this.project);
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name,
        [
          Validators.required
        ]),
        isPublic: new FormControl(this.project.isPublic),
        description: new FormControl(this.project.description,
          [
            Validators.required
          ])
    });
  }


  reset() {
    this.projectForm.reset(this.project);
  }
  save(project: Project) {
    this.project = Object.assign(this.project, project);
    this.projectService.updateProject(this.project).subscribe(() =>
    {
      this.toastrService.showSuccess('Project successfully updated');
    }, (err) => {
      this.toastrService.showError(err);
    });
  }
}
