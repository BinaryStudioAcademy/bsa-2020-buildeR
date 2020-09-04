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
import {projectNameAsyncValidator} from "@modules/project/validators/project-name.async-validator";
import {User} from "@shared/models/user/user";

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {

  isChanged = false;
  isLoading = false;
  projectId: number;
  branches: string [] = ['master', 'dev'];
  public envVarsForm: FormGroup;
  public projectForm: FormGroup;
  @Input()envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;
  envVariables: EnviromentVariable[] = [];
  @Input() project: Project = {} as Project;
  currentUser: User = {} as User;

  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  )
  { }

  ngOnInit(): void {

    this.route.parent.data.subscribe(data => {
      this.currentUser = data.user;
    });

    this.route.parent.params.subscribe(
      (params) => this.projectId = params.projectId);
    this.route.parent.data.subscribe(data => this.project = data.project);

    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern(`^(?![-\\.])(?!.*--)(?!.*\\.\\.)[A-Za-z0-9-\\._ ]+(?<![-\\.])$`)
        ],
        [
          projectNameAsyncValidator(this.projectService, this.currentUser, this.project.id)
        ]),
        isPublic: new FormControl(this.project.isPublic.toString()),
        description: new FormControl(this.project.description,
          [
            Validators.maxLength(300),
            Validators.pattern('[^А-яа-я]*')
          ])
    });

    this.projectForm.valueChanges.subscribe(changesSettigsForm => {
      this.isChanged = false;
      if (this.project.name === this.projectForm.value.name) {
        this.isChanged = true;
      }
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
    this.isChanged = true;
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
    this.projectService.deleteEnviromentVariable(envVar).subscribe(
      () => {
        this.envVariables = this.envVariables.filter(x => x.id !== envVar.id);
        this.toastrService.showSuccess('Enviroment Variable deleted');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }

  edit(envVar: EnviromentVariable){
    const index = this.envVariables.findIndex(x => x.id === envVar.id);
    this.projectService.updateEnviromentVariable(envVar).subscribe(
      () => {
        this.envVariables.splice(index, 1, envVar);
        this.toastrService.showSuccess('Enviroment Variable updated');
      },
      (error) => this.toastrService.showError(error.message, error.name)
    );
  }
}
