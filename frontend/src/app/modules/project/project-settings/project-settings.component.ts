import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { VariableValue } from '@shared/models/environment-variable/variable-value';
import {projectNameAsyncValidator} from '@modules/project/validators/project-name.async-validator';
import {User} from '@shared/models/user/user';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {

  isChanged = false;
  isLoading = false;
  isShowSpinner = false;
  projectId: number;
  branches: string [] = ['master', 'dev'];
  public envVarsForm: FormGroup;
  public projectForm: FormGroup;
  @Input()envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;
  envVariables: EnviromentVariable[] = [];

  changedProject: Project = {} as Project;
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
      this.changedProject = (changesSettigsForm as Project);
      this.isChanged = false;
      if (this.project.name === this.changedProject.name &&
      this.project.description === this.changedProject.description &&
      this.project.isPublic.toString() === this.changedProject.isPublic.toString()) {
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
    this.isShowSpinner = true;
    this.project = Object.assign(this.project, project);
    this.projectService.updateProject(this.project).subscribe(() =>
    {
      this.isShowSpinner = false;
      this.projectService.changeProjectName(this.project.name);
      this.toastrService.showSuccess('Project successfully updated');
    }, (err) => {
      this.isShowSpinner = false;
      this.toastrService.showSuccess('Project wasn\'t updated');
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
    let err = false;
    this.envVar.projectId = this.project.id;
    this.envVar.id = this.createId();
    this.envVar.data = envValue;
    if (!this.envVar.data.isSecret) {
      this.envVar.data.isSecret = false;
    }
    console.log(this.envVar);
    this.projectService.addEnvironmentVariable(this.envVar).subscribe(
      () => {
        this.toastrService.showSuccess('Enviroment Variable added');
      },
      (error) => {
        err = true;
        this.toastrService.showError(error.message, error.name);
      },
      () => {
        if (!err) {
          this.envVarsForm.reset();
          this.loadEnvVars();
        }
      }
    );
  }
  createId(): number{
    if (this.envVariables?.length > 0) {
      // tslint:disable-next-line: no-shadowed-variable
      return Math.max.apply(null, this.envVariables.map((env) => env.id)) + 1;
    }
    return 0;
  }

  delete(envVar: EnviromentVariable){
    let err = false;

    this.projectService.deleteEnviromentVariable(envVar).subscribe(
      () => {
        this.toastrService.showSuccess('Enviroment Variable deleted');
      },
      (error) => {
        err = true;
        this.toastrService.showError(error.message, error.name);
      },
      () => {
        if (!err) {
          this.envVariables = this.envVariables.filter(x => x.id !== envVar.id);
        }
      }

    );
  }

  edit(envVar: EnviromentVariable){
    const index = this.envVariables.findIndex(x => x.id === envVar.id);
    let err = false;

    this.projectService.updateEnviromentVariable(envVar).subscribe(
      () => {
        this.toastrService.showSuccess('Enviroment Variable updated');
      },
      (error) => {
        err = true;
        this.toastrService.showError(error.message, error.name);
      },
      () => {
        if (!err) {
          this.envVariables.splice(index, 1, envVar);
        }
      }
    );
  }
}
