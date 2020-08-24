import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '@shared/models/project/project';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { BuildStepService } from '@core/services/build-step.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { BuildStep } from '@shared/models/build-step';
import { EmptyBuildStep } from '@shared/models/empty-build-step';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EnvVariable } from '@shared/models/env-variable';
import { Arg } from '@shared/models/arg';


@Component({
  selector: 'app-project-build-steps',
  templateUrl: './project-build-steps.component.html',
  styleUrls: ['./project-build-steps.component.sass']
})
export class ProjectBuildStepsComponent extends BaseComponent implements OnInit, OnDestroy {
  projectId: number;
  project: Project = {} as Project;
  buildSteps: BuildStep[];
  emptyBuildSteps: EmptyBuildStep[];
  isLoading = true;
  isAdding = false;
  newBuildStep: EmptyBuildStep = {} as EmptyBuildStep;
  workDir: string;
  envVariables: EnvVariable[] = new Array();
  args: Arg[] = new Array();

  newEnvVariableKey: string = null;
  newEnvVariableValue: string = null;

  newArgKey: string = null;
  newArgValue: string = null;

  constructor(
    private projectService: ProjectService,
    private buildStepService: BuildStepService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  ) {
    super();
    route.parent.params.subscribe((params) => this.projectId = params.projectId);
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.project = this.route.snapshot.data.project as Project;
    this.getProject(this.projectId);
    this.getProjectBuildSteps(this.projectId);
    this.getEmptyBuildSteps();
  }

  getProject(projectId: number) {
    this.isLoading = true;
    this.projectService
      .getProjectById(projectId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.project = data;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error.message, error.name);
        }
      );
  }

  getEmptyBuildSteps() {
    this.isLoading = true;
    this.buildStepService
      .getEmptyBuildSteps()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.emptyBuildSteps = resp.body;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  getProjectBuildSteps(projectId: number) {
    this.isLoading = true;
    this.buildStepService
      .getBuildStepsByProject(projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.buildSteps = resp.body;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  addBuildStep() {
    this.isAdding = true;
    this.newBuildStep = this.emptyBuildSteps[0];
  }

  cancelBuildStep() {
    this.newBuildStep = null;
    this.isAdding = false;
    this.workDir = null;
    this.envVariables = null;
    this.args = null;

    this.clearNewEnvVariable();
    this.clearNewArg();
  }

  addEnvVariable() {
    this.newEnvVariableKey = '';
    this.newEnvVariableValue = '';
  }

  saveEnvVariable() {
    const newEnvVariable = {
      key: this.newEnvVariableKey,
      value: this.newEnvVariableValue
    } as EnvVariable;
    this.envVariables.push(newEnvVariable);
    this.clearNewEnvVariable();
  }

  removeNewEnvVariable(key: string) {
    this.envVariables = this.envVariables.filter(envVar => envVar.key !== key);
  }

  clearNewEnvVariable() {
    this.newEnvVariableKey = null;
    this.newEnvVariableValue = null;
  }

  addArg() {
    this.newArgKey = '';
    this.newArgValue = '';
  }

  saveArg() {
    const newArg = {
      key: this.newArgKey,
      value: this.newArgValue
    } as Arg;
    this.args.push(newArg);
    this.clearNewArg();
  }

  removeNewArg(key: string) {
    this.args = this.args.filter(arg => arg.key !== key);
  }

  clearNewArg() {
    this.newArgKey = null;
    this.newArgValue = null;
  }


  saveBuildStep() {
    const buildStep = {
      pluginCommand: this.newBuildStep.pluginCommand,
      index: this.buildSteps.length,
      buildStepName: this.newBuildStep.buildStepName,
      pluginCommandId: this.newBuildStep.pluginCommand.id,
      projectId: this.projectId,
      workDirectory: this.workDir,
      args: this.args,
      envVariables: this.envVariables
    } as BuildStep;
    this.cancelBuildStep();

    this.isLoading = true;
    this.buildStepService
      .createBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.buildSteps.push(resp);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  removeBuildStep(buildStep: BuildStep) {
    this.isLoading = true;
    this.buildStepService
      .removeBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isLoading = false;
          this.buildSteps = this.buildSteps.filter(step => buildStep.id !== step.id);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex !== event.previousIndex) {
      this.increaseIndexesOfBuildStepsFrom(this.projectId, event.currentIndex, event.previousIndex);
    }
  }

  increaseIndexesOfBuildStepsFrom(projectId: number, newIndex: number, oldIndex: number) {
    this.isLoading = true;
    this.buildStepService
      .udpateIndexesOfBuildSteps(projectId, newIndex, oldIndex)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isLoading = false;
          moveItemInArray(this.buildSteps, oldIndex, newIndex);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }
}
