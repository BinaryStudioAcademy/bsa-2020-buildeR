import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/enviroment-variable';
import { env } from 'process';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  isLoading = false;
  projectId: number;
  branches: string [] = ['master', 'dev'];
  public envVarsForm: FormGroup;
  public projectForm: FormGroup;
  envVar: EnviromentVariable = {} as EnviromentVariable;
  envVariables: EnviromentVariable[] = [];
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

    this.envVarsForm = new FormGroup({
      name: new FormControl(this.envVar.name,
        [
          Validators.required
        ]),
      value: new FormControl(this.envVar.value,
        [
          Validators.required
        ]),
        branch: new FormControl(this.envVar.branch),
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

  addEnvVar(envVar: EnviromentVariable){
    if (!envVar.branch){
      envVar.branch = this.branches[0];
    }
    this.envVariables.push(envVar);
    this.envVarsForm.reset();
  }


  remvove(envVar: EnviromentVariable){
    const index = this.envVariables.lastIndexOf(envVar);
    this.envVariables.splice(index, 1);
  }

  edit(envVar: EnviromentVariable){
    console.log(envVar);
  }
}
