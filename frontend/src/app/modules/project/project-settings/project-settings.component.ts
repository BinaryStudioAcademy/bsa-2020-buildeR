import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { VariableValue } from '@shared/models/environment-variable/variable-value';
import { enableDebugTools } from '@angular/platform-browser';
import { env } from 'process';

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
  @Input()envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;
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
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name,
        [
          Validators.required
        ]),
        isPublic: new FormControl(this.project.isPublic.toString()),
        description: new FormControl(this.project.description,
          [
            Validators.required
          ])
    });

    this.envVarsForm = new FormGroup({
      name: new FormControl(this.envVar.data.name,
        [
          Validators.required
        ]),
      value: new FormControl(this.envVar.data.value,
        [
          Validators.required
        ]),
        isSecret: new FormControl(this.envVar.data.isSecret)
    });
    this.projectService.envVariable.subscribe((res) => {
      this.edit(res);
    });
    this.projectService.deleteEnvVariable.subscribe((res) => {
      this.delete(res);
    });

    this.loadEnvVars();
  }

  reset() {
    this.projectForm.reset(this.project);
  }
  save(project: Project) {
    this.project = Object.assign(this.project, project);
    this.projectService.updateProject(this.project).subscribe(() =>
    {
      this.projectService.changeProjectName(this.project.name);
      this.toastrService.showSuccess('Project successfully updated');
    }, (err) => {
      this.toastrService.showError(err);
    });
  }

  loadEnvVars(){
    this.projectService.getEnvironmentVariables(this.project.id).subscribe((res) => {
      this.envVariables = res;
    });
  }

  addEnvVar(envValue: VariableValue){
    this.envVar.projectId = this.project.id;
    this.envVar.id = this.createId();
    this.envVar.data = envValue;
    if (!this.envVar.data.isSecret) {
      this.envVar.data.isSecret = false;
    }
    console.log(this.envVar);
    this.projectService.addEnvironmentVariable(this.envVar).subscribe(() => {
      this.envVariables.push(this.envVar);
      this.envVarsForm.reset();
      this.loadEnvVars();
    }, (err) => {
      console.log(err);
    });
  }
  createId(): number{
    if (this.envVariables.length > 0) {
      // tslint:disable-next-line: no-shadowed-variable
      return Math.max.apply(null, this.envVariables.map((env) => env.id)) + 1;
    }
    return 0;
  }

  delete(envVar: EnviromentVariable){
    this.projectService.deleteEnviromentVariable(envVar).subscribe(() => {
     this.loadEnvVars();
   });
  }

  edit(envVar: EnviromentVariable){
    this.projectService.updateEnviromentVariable(envVar).subscribe(() => {
      this.loadEnvVars();
    });
  }
}
