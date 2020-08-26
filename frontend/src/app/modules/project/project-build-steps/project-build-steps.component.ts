import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '@shared/models/project/project';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { CommandArgumentService } from '@core/services/command-argument.service';
import { BuildPluginService } from '@core/services/build-plugin.service';
import { BuildStepService } from '@core/services/build-step.service';
import { BaseComponent } from '@core/components/base/base.component';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BuildStep } from '@shared/models/build-step';
import { EmptyBuildStep } from '@shared/models/empty-build-step';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommandArgument } from '@shared/models/command-argument';
import { Observable } from 'rxjs';


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
  commandArguments: CommandArgument[] = new Array();

  newEnvVariableKey: string = null;
  newEnvVariableValue: string = null;

  newCommandArgumentKey: string = null;
  newCommandArgumentValue: string = null;

  version: string;
  versions: string[];

  constructor(
    private projectService: ProjectService,
    private buildStepService: BuildStepService,
    private commandArgumentService: CommandArgumentService,
    private buildPluginService: BuildPluginService,
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
    this.commandArguments = null;
    this.version = null;

    this.clearNewCommandArgument();
  }

  addCommandArgument() {
    this.newCommandArgumentKey = '';
    this.newCommandArgumentValue = '';
  }

  saveCommandArgument() {
    const newCommandArgument = {
      key: this.newCommandArgumentKey,
      value: this.newCommandArgumentValue
    } as CommandArgument;
    if (!this.commandArguments) {
      this.commandArguments = new Array();
    }
    this.commandArguments.push(newCommandArgument);
    this.clearNewCommandArgument();
  }

  removeNewCommandArgument(key: string) {
    this.commandArguments = this.commandArguments.filter(commandArgument => commandArgument.key !== key);
  }

  clearNewCommandArgument() {
    this.newCommandArgumentKey = null;
    this.newCommandArgumentValue = null;
  }

  removeExistingCommandArgument(buildStep: BuildStep, argumentId: number) {
    this.isLoading = true;
    this.commandArgumentService
      .removeCommandArgument(argumentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isLoading = false;
          buildStep.commandArguments = buildStep.commandArguments.filter(commandArgument => commandArgument.id !== argumentId);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  getVersions(buildPluginName: string, versionTerm: string) {
    if (versionTerm.length < 2) {
      return;
    }

    this.isLoading = true;
    this.buildPluginService
      .getVersionsOfBuildPlugin(buildPluginName, versionTerm)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.versions = resp.body;
          console.log(this.versions);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 2
          ? [] : this.buildPluginService.versionsLookup(this.newBuildStep.buildPlugin.dockerRegistryName, term))
    );
  }

  saveBuildStep() {
    const buildStep = {
      pluginCommand: this.newBuildStep.pluginCommand,
      index: this.buildSteps.length,
      buildStepName: this.newBuildStep.buildStepName,
      pluginCommandId: this.newBuildStep.pluginCommand.id,
      projectId: this.projectId,
      workDirectory: this.workDir,
      commandArguments: this.commandArguments
    } as BuildStep;
    buildStep.pluginCommand.plugin.version = this.version;
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
