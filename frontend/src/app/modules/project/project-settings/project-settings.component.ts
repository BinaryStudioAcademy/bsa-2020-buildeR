import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { VariableValue } from '@shared/models/environment-variable/variable-value';
import { projectNameAsyncValidator } from '@modules/project/validators/project-name.async-validator';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@core/components/base/base.component';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent extends BaseComponent implements OnInit {
  @Input() project: Project = {} as Project;
  @Input() envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;

  isChanged = false;
  isLoading = false;
  isShowSpinner = false;
  projectId: number;
  isLoadedEnvVar = false;
  branches: string [] = ['master', 'dev'];
  envVarsForm: FormGroup;
  projectForm: FormGroup;
  envVariables: EnviromentVariable[] = [];
  changedProject: Project = {} as Project;
  currentUser: User = {} as User;

  constructor(
    private projectService: ProjectService,
    private authService: AuthenticationService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.route.parent.data.subscribe(data => {
      this.project = data.project;
      this.createProjectForm();
    });

    this.loadEnvVars();
    this.envVarsForm = new FormGroup({
      name: new FormControl(this.envVar.data.name,
        [
          Validators.required,
          this.isNotUniqueName()
        ]),
      value: new FormControl(this.envVar.data.value,
        [
          Validators.required
        ]),
        isSecret: new FormControl(this.envVar.data.isSecret)
    });
    this.projectService.envVariable.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.edit(res);
    });
    this.projectService.deleteEnvVariable.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.delete(res);
    });
  }

  createProjectForm() {
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

  }
  reset() {
    this.projectForm.reset(this.project);
    this.projectForm.controls.isPublic.setValue(this.project.isPublic.toString());
  }
  save(project: Project) {
    this.isShowSpinner = true;
    project.isPublic = project.isPublic.toString() === 'true';
    this.project = Object.assign(this.project, project);
    this.projectService.updateProject(this.project).subscribe(() =>
    {
      this.isShowSpinner = false;
      this.projectService.changeProjectName(this.project.name);
      this.projectService.changeProjectLevel(this.project.isPublic);
      this.toastrService.showSuccess('Project successfully updated');
    }, (err) => {
      this.isShowSpinner = false;
      this.toastrService.showSuccess('Project wasn\'t updated');
      this.toastrService.showError(err.error, err.name);
    });
    this.isChanged = true;
  }

  loadEnvVars() {
    this.projectService.getEnvironmentVariables(this.project.id).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (res) => {
        this.envVariables = res;
        this.isLoadedEnvVar = true;
      },
      (error) => this.toastrService.showError(error.message, error.name),
    );
  }

  addEnvVar(envValue: VariableValue){
    let err = false;
    this.envVar.projectId = this.project.id;
    this.envVar.id = envValue.name;
    this.envVar.data = envValue;
    if (!this.envVar.data.isSecret) {
      this.envVar.data.isSecret = false;
    }
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
          envVar.id = envVar.data.name;
          this.envVariables.splice(index, 1, envVar);
        }
      }
    );
  }
  isNotUniqueName(): ValidatorFn {
    return control => {
      const isNotUnique = this.envVariables.some(x => x.data.name === control.value);
      return isNotUnique ? { isNotUniqueName: {value: control.value}} : null;
    };
  }
  isNotUniqueCheckChanges(input: string): boolean {
    return this.envVariables.some(x => x.data.name === input);
  }
}
