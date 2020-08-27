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

  addBuildStep(step: BuildStep) {
    step.isAdding = !step.isAdding;
  }

  addCommandArgument(step: BuildStep) {
    step.newCommandArgumentKey = '';
    step.newCommandArgumentValue = '';
  }

  saveCommandArgument(step: BuildStep) {
    const newCommandArgument = {
      buildStepId: step.id,
      key: step.newCommandArgumentKey,
      value: step.newCommandArgumentValue
    } as CommandArgument;
    step.commandArguments.push(newCommandArgument);
    this.clearNewCommandArgument(step);
  }


  clearNewCommandArgument(step: BuildStep) {
    step.newCommandArgumentKey = undefined;
    step.newCommandArgumentValue = undefined;
  }

  removeExistingCommandArgument(step: BuildStep, argumentId: number, key: string) {
    step.commandArguments = step.commandArguments.filter(commandArgument => commandArgument.key !== key);
    this.isLoading = true;
    this.commandArgumentService
      .removeCommandArgument(argumentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isLoading = false;
          step.commandArguments = step.commandArguments.filter(commandArgument => commandArgument.id !== argumentId);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  editCommandArgument(arg: CommandArgument) {
    this.isLoading = true;
    this.commandArgumentService.updateCommandArgument(arg)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        });
  }

  public searchFunctionFactory(step: BuildStep): (text: Observable<string>) => Observable<any[]> {
    const search = (text$: Observable<string>) => {
      return text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          switchMap(term => term.length < 2
            ? [] : this.buildPluginService.versionsLookup(step.pluginCommand.plugin.dockerRegistryName, term))
      );
    };
    return search;
}

  saveBuildStep(step: EmptyBuildStep) {
    const buildStep = {
      pluginCommand: step.pluginCommand,
      index: this.buildSteps.length,
      buildStepName: step.buildStepName,
      pluginCommandId: step.pluginCommand.id,
      projectId: this.projectId,
      workDirectory: this.workDir,
      commandArguments: this.commandArguments
    } as BuildStep;

    this.isLoading = true;
    this.buildStepService
      .createBuildStep(buildStep)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.buildSteps.push(resp);
          this.getProjectBuildSteps(this.projectId);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }
      );
  }

  updateAllSteps() {
    this.isLoading = true;
    this.buildSteps.forEach(step =>
      this.buildStepService.updateBuildStep(step)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.getProjectBuildSteps(this.projectId);
        },
        (error) => {
          this.isLoading = false;
          this.toastrService.showError(error);
        }));
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

  expandAll() {
    this.buildSteps.forEach(step => {
      step.isAdding = true;
    });
  }

  collapseAll() {
    this.buildSteps.forEach(step => {
      step.isAdding = false;
    });
  }
}
